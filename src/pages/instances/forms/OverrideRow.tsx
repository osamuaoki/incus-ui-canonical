import React, { ReactNode } from "react";
import { CheckboxInput, Label } from "@canonical/react-components";
import { SharedFormikTypes } from "pages/instances/forms/sharedFormTypes";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { fetchProfiles } from "api/profiles";
import { useParams } from "react-router-dom";
import { figureInheritedValue } from "util/formFields";
import { CpuLimit, MemoryLimit } from "types/limits";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";

interface Props {
  formik: SharedFormikTypes;
  name: string;
  label: string;
  children: ReactNode;
  defaultValue?: string | CpuLimit | MemoryLimit;
  disabled?: boolean;
}

export const getOverrideRow = ({
  formik,
  name,
  label,
  children,
  defaultValue,
  disabled = undefined,
}: Props): MainTableRow => {
  const { project } = useParams<{ project: string }>();
  if (!project) {
    return <>Missing project</>;
  }

  const { data: profiles = [] } = useQuery({
    queryKey: [queryKeys.profiles],
    queryFn: () => fetchProfiles(project),
  });

  const values = formik.values as unknown as Record<string, string | undefined>;
  const isOverridden = values[name] !== undefined;

  const toggleDefault = () => {
    if (isOverridden) {
      formik.setFieldValue(name, undefined);
    } else {
      formik.setFieldValue(name, defaultValue);
    }
  };

  const [inheritedValue, inheritSource] = figureInheritedValue(
    formik.values,
    name,
    profiles
  );

  return {
    columns: [
      {
        content: (
          <CheckboxInput
            label={undefined}
            checked={isOverridden}
            onChange={toggleDefault}
            disabled={disabled}
          />
        ),
      },
      {
        content: isOverridden ? <Label forId={name}>{label}</Label> : label,
      },
      {
        content: isOverridden ? children : inheritedValue,
      },
      {
        content: isOverridden ? undefined : inheritSource,
      },
    ],
  };
};
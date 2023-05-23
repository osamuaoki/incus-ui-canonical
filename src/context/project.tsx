import React, { createContext, FC, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { fetchProject } from "api/projects";
import { LxdProject } from "types/project";
import { useLocation } from "react-router-dom";
import { getProjectFromUrl } from "util/projects";

interface ContextProps {
  project?: LxdProject;
  isLoading: boolean;
}

const initialState: ContextProps = {
  project: undefined,
  isLoading: false,
};

export const ProjectContext = createContext<ContextProps>(initialState);

interface ProviderProps {
  children: ReactNode;
}

export const ProjectProvider: FC<ProviderProps> = ({ children }) => {
  const location = useLocation();
  const project = getProjectFromUrl(location.pathname);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.projects, project],
    queryFn: () => fetchProject(project),
  });

  return (
    <ProjectContext.Provider
      value={{
        project: data,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  return useContext(ProjectContext);
}

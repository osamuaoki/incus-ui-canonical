import React, { FC } from "react";
import { fetchInstance } from "./api/instances";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./util/queryKeys";
import useNotification from "./util/useNotification";
import { fetchMetrics } from "./api/metrics";
import { humanFileSize, isoTimeToString } from "./util/helpers";
import { getInstanceMetrics } from "./util/metricSelectors";
import Meter from "./components/Meter";
import DeleteInstanceBtn from "./buttons/instances/DeleteInstanceBtn";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "@canonical/react-components";
import StartInstanceBtn from "./buttons/instances/StartInstanceBtn";
import StopInstanceBtn from "./buttons/instances/StopInstanceBtn";
import EditInstanceBtn from "./buttons/instances/EditInstanceBtn";

interface Props {
  instanceName: string;
}

const InstanceOverview: FC<Props> = ({ instanceName }) => {
  const navigate = useNavigate();
  const notify = useNotification();

  const { data: instance, error } = useQuery({
    queryKey: [queryKeys.instances, instanceName],
    queryFn: () => fetchInstance(instanceName),
  });

  if (error) {
    notify.failure("Could not load instance details.", error);
  }

  const { data: metrics = [], error: metricError } = useQuery({
    queryKey: [queryKeys.metrics],
    queryFn: fetchMetrics,
    refetchInterval: 15 * 1000, // 15 seconds
  });

  if (metricError) {
    notify.failure("Could not load metrics.", metricError);
  }

  if (!instance) {
    return <>Could not load instance details.</>;
  }
  const instanceMetrics = getInstanceMetrics(metrics, instance);

  return (
    <Row>
      <Col size={8}>
        <table>
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{instance.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{instance.description}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{instance.status}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{isoTimeToString(instance.created_at)}</td>
            </tr>
            <tr>
              <th>Last used at</th>
              <td>{isoTimeToString(instance.last_used_at)}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>
                {instance.state?.network?.eth0?.addresses
                  .map((item) => item.address)
                  .join(" ")}
              </td>
            </tr>
            <tr>
              <td>Memory</td>
              <td>
                {instanceMetrics.memory && (
                  <div>
                    <Meter
                      percentage={
                        (100 / instanceMetrics.memory.total) *
                        (instanceMetrics.memory.total -
                          instanceMetrics.memory.free)
                      }
                      text={
                        humanFileSize(
                          instanceMetrics.memory.total -
                            instanceMetrics.memory.free
                        ) +
                        " of " +
                        humanFileSize(instanceMetrics.memory.total) +
                        " memory used"
                      }
                    />
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td>Disk</td>
              <td>
                {instanceMetrics.disk && (
                  <div>
                    <Meter
                      percentage={
                        (100 / instanceMetrics.disk.total) *
                        (instanceMetrics.disk.total - instanceMetrics.disk.free)
                      }
                      text={
                        humanFileSize(
                          instanceMetrics.disk.total - instanceMetrics.disk.free
                        ) +
                        " of " +
                        humanFileSize(instanceMetrics.disk.total) +
                        " disk used"
                      }
                    />
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <th>Type</th>
              <td>{instance.type}</td>
            </tr>
            <tr>
              <th>Architecture</th>
              <td>{instance.architecture}</td>
            </tr>
            <tr>
              <th>Stateful</th>
              <td>{instance.stateful ? "true" : "false"}</td>
            </tr>
            <tr>
              <th>Project</th>
              <td>{instance.project}</td>
            </tr>
            <tr>
              <th>Profiles</th>
              <td>{instance.profiles.join(", ")}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>{instance.location}</td>
            </tr>
            <tr>
              <th>Ephemeral</th>
              <td>{instance.ephemeral ? "true" : "false"}</td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col size={4}>
        <StartInstanceBtn instance={instance} notify={notify} />
        <StopInstanceBtn instance={instance} notify={notify} />
        <EditInstanceBtn instance={instance} />
        <DeleteInstanceBtn
          instance={instance}
          notify={notify}
          onFinish={() => navigate("/instances")}
        />
      </Col>
    </Row>
  );
};

export default InstanceOverview;

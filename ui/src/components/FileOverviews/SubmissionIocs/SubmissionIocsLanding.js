import React, { useState, useEffect } from "react";
import { Collapse, Typography, Tag } from "antd";
import IocOverviewCard from "./SubmissionIocOverviewCard";

const { Text } = Typography;

const FilePotentialIocsOverview = ({ selectedNodeData, expandAll }) => {
  const iocs = selectedNodeData?.iocs;
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!iocs || iocs.length === 0) {
    return null;
  }

  const firstIoc = iocs[0]?.ioc || "N/A";
  const iocsCount = iocs.length;
  const additionalIocs = iocsCount > 1 ? ` and ${iocsCount - 1} more` : "";

  return (
    <Collapse
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys)}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Collapse.Panel
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>Indicators of Compromise (IOCs)</Text>
              <div style={{ fontSize: "smaller", color: "#888" }}>
                {firstIoc}
                {additionalIocs}
              </div>
            </div>
            <Tag color="purple">
              <b>{iocsCount} Potential IOCs Extracted</b>
            </Tag>
          </div>
        }
        key="1"
      >
        <IocOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default FilePotentialIocsOverview;

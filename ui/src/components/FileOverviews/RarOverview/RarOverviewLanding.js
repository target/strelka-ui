import React, { useState, useEffect } from "react";
import { Collapse, Typography, Tag } from "antd";
import RarOverviewCard from "./RarOverviewCard"; 

const { Text } = Typography;

const RarOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ['1'] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.rar) {
    return null;
  }

  const rarData = selectedNodeData.scan.rar;
  const fileCount = rarData.total.files || 0;
  const extractedCount = rarData.total.extracted || 0;
  const extractionStatus = fileCount > 0 && extractedCount === 0 ? "Could Not Extract Files" : "Extracted Files";

  return (
    <Collapse
      defaultActiveKey={[]}
      activeKey={activeKey}
      onChange={setActiveKey}
      style={{ width: '100%', marginBottom: '10px' }}
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
              <Text strong>RAR Details</Text>
              <div style={{ fontSize: "smaller", color: "#888" }}>
                Total Files: {fileCount}
              </div>
            </div>
            <Tag
              style={{ alignSelf: "center" }}
              color={extractionStatus === "Extracted Files" ? "green" : "red"}
            >
              <b>{extractionStatus}</b>
            </Tag>
          </div>
        }
        key="1"
      >
        <RarOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default RarOverviewLanding;

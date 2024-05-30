// FileOverviews/FileOverview/FileOverviewLanding.js
import React from "react";
import { Collapse, Button, Typography } from "antd";
import FileOverviewCard from "./FileOverviewCard";

const { Panel } = Collapse;
const { Text } = Typography;

const FileOverviewLanding = ({
  selectedNodeData,
  onOpenVT,
  expandAll,
  onToggleAllSections,
}) => {
  if (!selectedNodeData) {
    return null;
  }

  return (
    <Collapse
      style={{ width: "100%", marginBottom: "10px" }}
      defaultActiveKey={["1"]}
    >
      <Panel
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>File Overview</Text>
              <div style={{ fontSize: "smaller", color: "#888" }}>
                Size: {(selectedNodeData.file.size / 1024).toFixed(2)} KB (
                {selectedNodeData.file.size} bytes)
              </div>
            </div>
            <Button style={{fontSize: "12px"}}onClick={onToggleAllSections}>
        {expandAll ? 'Collapse All Sections' : 'Expand All Sections'}
      </Button>
          </div>
        }
        key="1"
      >
        <FileOverviewCard data={selectedNodeData} onOpenVT={onOpenVT} />
      </Panel>
    </Collapse>
  );
};

export default FileOverviewLanding;

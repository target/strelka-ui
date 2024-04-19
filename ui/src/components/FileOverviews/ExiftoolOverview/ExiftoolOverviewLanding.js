import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';
import FileExiftoolCard from './ExiftoolOverviewCard'; 

const { Text } = Typography;

const ExiftoolOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.exiftool) {
    return null;
  }

  const metadataCount = Object.keys(selectedNodeData.scan.exiftool).length;

  return (
    <Collapse
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys)}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Collapse.Panel
        header={
          <div>
            <Text strong>File Metadata</Text>
            <div style={{ fontSize: "smaller", color: "#888" }}>
              Metadata Count: {metadataCount}
            </div>
          </div>
        }
        key="1"
      >
        <FileExiftoolCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default ExiftoolOverviewLanding;

import React, { useState, useEffect } from 'react';
import { Collapse, Typography, Tag } from 'antd';
import SevenZipOverviewCard from './SevenZipOverviewCard'; 

const { Text } = Typography;

const SevenZipOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ['1'] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.seven_zip) {
    return null;
  }

  const sevenZipData = selectedNodeData.scan.seven_zip;
  const fileCount = sevenZipData.total.files || 0;
  const extractedCount = sevenZipData.total.extracted || 0;
  const extractionStatus = extractedCount === 0 ? "Could Not Extract Files" : "Extracted Files";

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
              <Text strong>7-Zip Details</Text>
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
        <SevenZipOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default SevenZipOverviewLanding;

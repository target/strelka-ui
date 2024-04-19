import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';
import JavascriptOverviewCard from './JavascriptOverviewCard';

const { Text } = Typography;

const JavascriptOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.javascript) {
    return null;
  }

  const jsData = selectedNodeData.scan.javascript;
  const scriptLength = jsData.script_length_bytes 
    ? `${jsData.script_length_bytes} bytes` 
    : "(Length calculation not supported by this release of Strelka)";

  return (
    <Collapse
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys)}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Collapse.Panel
        header={
          <div>
            <Text strong>JavaScript</Text>
            <div style={{ fontSize: "smaller", color: "#888" }}>
              Script Length: {scriptLength}
            </div>
          </div>
        }
        key="1"
      >
        <JavascriptOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default JavascriptOverviewLanding;

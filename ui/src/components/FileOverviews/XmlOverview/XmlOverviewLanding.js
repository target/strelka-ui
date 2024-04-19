import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';
import XmlOverviewCard from './XmlOverviewCard';

const { Text } = Typography;

const XmlOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ['1'] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.xml) {
    return null;
  }

  const xmlData = selectedNodeData.scan.xml;
  const emittedContentCount = xmlData.emitted_content ? xmlData.emitted_content.length : 0;

  return (
    <Collapse
      defaultActiveKey={['']}
      activeKey={activeKey}
      onChange={setActiveKey}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Collapse.Panel
        header={
          <div>
            <Text strong>XML</Text>
            <div style={{ fontSize: "smaller", color: "#888" }}>
              Emitted Content Count: {emittedContentCount}
            </div>
          </div>
        }
        key="1"
      >
        <XmlOverviewCard xmlData={xmlData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default XmlOverviewLanding;

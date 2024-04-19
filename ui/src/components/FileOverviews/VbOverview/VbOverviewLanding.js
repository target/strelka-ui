import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';
import VbOverviewCard from './VbOverviewCard'; 

const { Text } = Typography;

const VbOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ['1'] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.vb) {
    return null;
  }

  const vbData = selectedNodeData.scan.vb;
  const scriptLength = vbData.script_length_bytes || 0;

  return (
    <Collapse
      defaultActiveKey={[]}
      activeKey={activeKey}
      onChange={setActiveKey}
      style={{ width: '100%', marginBottom: '10px' }}
    >
      <Collapse.Panel
        header={
          <div style={{ marginLeft: '8px' }}>
            <Text strong>Visual Basic</Text>
            <div style={{ fontSize: 'smaller', color: '#888' }}>
              Script Length: {scriptLength} bytes
            </div>
          </div>
        }
        key="1"
      >
        <VbOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default VbOverviewLanding;

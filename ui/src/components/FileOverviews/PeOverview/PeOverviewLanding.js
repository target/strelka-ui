import React, { useState, useEffect } from 'react';
import { Collapse, Typography, Tag } from 'antd';
import PeOverviewCard from './PeOverviewCard';

const { Text } = Typography;

const PeOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.pe) {
    return null;
  }

  const { file_info, compile_time, security } = selectedNodeData.scan.pe;
  const productName = file_info?.product_name;
  const isSigned = security ? "Signed" : "Not Signed";

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
              <Text strong>Executable Information</Text>
              <div style={{ fontSize: "smaller", color: "#888" }}>
                Product: {productName}
                <br />
                Compiled: {compile_time}
              </div>
            </div>
            <Tag
              style={{ alignSelf: "center" }}
              color={security ? "success" : "error"}
            >
              <b>{isSigned}</b>
            </Tag>
          </div>
        }
        key="1"
      >
        <PeOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default PeOverviewLanding;

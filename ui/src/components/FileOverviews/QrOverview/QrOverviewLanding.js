import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';
import QrOverviewCard from './QrOverviewCard'; 

const { Text } = Typography;

const QrOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.qr || !selectedNodeData.scan.qr.data) {
    return null;
  }

  const qrData = selectedNodeData.scan.qr.data;
  const qrDataCount = qrData.length;

  return (
    <Collapse
      activeKey={activeKey}
      onChange={(keys) => setActiveKey(keys)}
      defaultActiveKey={[]}
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginLeft: "8px" }}>
                <Text strong>QR Code Data</Text>
                <div style={{ fontSize: "smaller", color: "#888" }}>
                  {qrDataCount > 0 ? `QR Data Count: ${qrDataCount}` : "No QR Data"}
                </div>
              </div>
            </div>
          </div>
        }
        key="1"
      >
        <QrOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default QrOverviewLanding;

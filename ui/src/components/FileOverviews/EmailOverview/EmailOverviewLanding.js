import React, { useState, useEffect } from 'react';
import { Collapse, Typography, Tag } from 'antd';
import EmailOverviewCard from './EmailOverviewCard'; 

const { Text } = Typography;

const EmailOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.email) {
    return null;
  }

  const emailData = selectedNodeData.scan.email;
  const subjectPreview = emailData.subject && emailData.subject.length > 0
    ? `${emailData.subject.substring(0, 47)}...`
    : "No Subject";
  const attachmentsCount = emailData.total && emailData.total.attachments;

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
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Text strong>Email</Text>
                <div style={{ fontSize: "smaller", color: "#888" }}>{subjectPreview}</div>
              </div>
            </div>
            <div>
              <Tag color="default">
                <b>Attachments: {attachmentsCount}</b>
              </Tag>
              <Tag
                color={emailData.base64_thumbnail ? "success" : "error"}
              >
                <b>{emailData.base64_thumbnail ? "Preview Available" : "No Preview"}</b>
              </Tag>
            </div>
          </div>
        }
        key="1"
      >
        <EmailOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default EmailOverviewLanding;

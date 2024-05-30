import React, { useState, useEffect } from "react";
import { Collapse, Typography, Tag } from "antd";
import EncryptedZipOverviewCard from "./EncryptedZipOverviewCard";

const { Text } = Typography;

const EncryptedZipOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (
    !selectedNodeData ||
    !selectedNodeData.scan ||
    !selectedNodeData.scan.encrypted_zip
  ) {
    return null;
  }

  const encryptedZipData = selectedNodeData.scan.encrypted_zip;
  const fileCount = encryptedZipData.total.files || 0;
  const extractedCount = encryptedZipData.total.extracted || 0;
  const extractionStatus =
    fileCount > 0 && extractedCount === 0
      ? "Could Not Extract Files"
      : "Extracted Files";

  return (
    <Collapse
      defaultActiveKey={[]}
      activeKey={activeKey}
      onChange={setActiveKey}
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
              <Text strong>Encrypted Zip Details</Text>
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
        <EncryptedZipOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default EncryptedZipOverviewLanding;

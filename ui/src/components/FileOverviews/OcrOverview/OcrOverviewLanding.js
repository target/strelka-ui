import React, { useState, useEffect } from 'react';
import { Collapse, Typography, Tag } from 'antd';
import OcrOverviewCard from './OcrOverviewCard';

const { Text } = Typography;

const OcrOverviewLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  if (!selectedNodeData || !selectedNodeData.scan || !selectedNodeData.scan.ocr) {
    return null;
  }

  const ocrData = selectedNodeData.scan.ocr;
  const ocrText = ocrData.text;
  const textSummary = Array.isArray(ocrText)
    ? ocrText.join(" ").substring(0, 47) + "..."
    : typeof ocrText === "string" && ocrText.length > 0
      ? ocrText.substring(0, 47) + "..."
      : "No Text";

  const wordsCount = Array.isArray(ocrText)
    ? ocrText.length
    : typeof ocrText === "string"
      ? ocrText.split(" ").length
      : 0;

  const hasPreview = !!ocrData.base64_thumbnail;

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
                <Text strong>Optical Character Recognition</Text>
                <div style={{ fontSize: "smaller", color: "#888" }}>
                  {textSummary}
                </div>
              </div>
            </div>
            <div>
              <Tag color="default">
                <b>Words Extracted: {wordsCount}</b>
              </Tag>
              <Tag color={hasPreview ? "success" : "error"}>
                <b>{hasPreview ? "Preview Available" : "No Preview"}</b>
              </Tag>
            </div>
          </div>
        }
        key="1"
      >
        <OcrOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  );
};

export default OcrOverviewLanding;

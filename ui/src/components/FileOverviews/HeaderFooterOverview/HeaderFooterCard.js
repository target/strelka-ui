import React from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

const FileHeaderFooterCard = ({ data }) => {
  // Helper function to format the text row for display.
  // Only render the row if the content is not undefined or null.
  const renderTextRow = (label, content, isCode = false, copyable = false) => {
    if (content === undefined || content === null) {
      return null;
    }

    return (
      <Row>
        <Col span={2}>
          <Text style={{ fontSize: "12px" }}>{label}</Text>
        </Col>
        <Col span={18}>
          <Text code={isCode} copyable={copyable} style={{ fontSize: "12px" }}>
            {content}
          </Text>
        </Col>
      </Row>
    );
  };

  return (
    <div style={{ padding: "10px" }}>
      <Text strong>Header</Text>
      {renderTextRow("Log:", data?.scan?.header?.header, true, true)}
      {renderTextRow("Raw:", data?.scan?.header?.raw, true, true)}
      {renderTextRow("Hex:", data?.scan?.header?.hex, true, true)}
      {renderTextRow("Backslash:", data?.scan?.header?.backslash, true, true)}
      <Text strong>Footer</Text>
      {renderTextRow("Log:", data?.scan?.footer?.footer, true, true)}
      {renderTextRow("Raw:", data?.scan?.footer?.raw, true, true)}
      {renderTextRow("Hex:", data?.scan?.footer?.hex, true, true)}
      {renderTextRow("Backslash:", data?.scan?.footer?.backslash, true, true)}
    </div>
  );
};

export default FileHeaderFooterCard;

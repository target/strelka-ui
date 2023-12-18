import React from "react";
import { Row, Col, Typography, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Text } = Typography;

/**
 * Component that displays an overview of a file's properties.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.data - The data object containing file and scan information.
 * @returns {JSX.Element} A JSX element representing the card.
 */
const FileOverviewCard = ({ data }) => {
  // Helper function to format the text row for display.
  const renderTextRow = (label, content, isCode = false, copyable = false) => (
    <Row>
      <Col span={2}>
        <Text style={{ fontSize: "12px" }}>{label}</Text>
      </Col>
      <Col span={18}>
        <Text code={isCode} copyable={copyable} style={{ fontSize: "12px" }}>
          {content || "Not Available"}
        </Text>
      </Col>
    </Row>
  );

  // Function to handle entropy styling
  const getEntropyStyle = (entropy) => {
    if (entropy > 6.5) {
      return { color: "#ff4d4f", fontWeight: "700" };
    } else if (entropy < 3.5) {
      return { color: "#4CAF50", fontWeight: "500" };
    }
    return { color: "#8D6E63", fontWeight: "500" };
  };

  // Function to handle entropy styling and tooltip
  const renderEntropy = (entropyValue) => {
    const entropyStyle = getEntropyStyle(entropyValue);
    const entropyTooltip = (
      <span>
        Entropy is a measure of randomness. High entropy (> 6.5) may indicate
        the file is packed, compressed, or encrypted, which could be a sign of
        an attempt to avoid detection.
      </span>
    );

    return (
      <Row>
        <Col span={2}>
          <Text style={{ fontSize: "12px" }}>Entropy:</Text>
        </Col>
        <Col span={18}>
          <Text style={{ fontSize: "12px", ...entropyStyle }}>
            {entropyValue.toFixed(3)}
            <Tooltip title={entropyTooltip}>
              <InfoCircleOutlined style={{ marginLeft: 5 }} />
            </Tooltip>
          </Text>
        </Col>
      </Row>
    );
  };

  return (
    <div style={{ padding: "10px" }}>
      {renderTextRow("File Name:", data.file.name)}
      {renderTextRow("MIME Type:", data.file.flavors.mime?.join(", "), true)}
      {renderTextRow("YARA Flavors:", data.file.flavors.yara?.join(", "), true)}
      {renderTextRow("MD5:", data.scan.hash.md5, true, true)}
      {renderTextRow("SHA1:", data.scan.hash.sha1, true, true)}
      {renderTextRow("SHA256:", data.scan.hash.sha256, true, true)}
      {renderTextRow("SSDeep:", data.scan.hash.ssdeep, true, true)}
      {renderTextRow("TLSH:", data.scan.hash.tlsh, true, true)}
      {renderTextRow(
        "Size:",
        `${(data.file.size / 1024).toFixed(2)} KB (${data.file.size} bytes)`
      )}
      {data.scan?.entropy && renderEntropy(data.scan.entropy.entropy)}
      <Row>
        <Col span={2}>
          <Text style={{ fontSize: "12px" }}>VirusTotal:</Text>
        </Col>
        <Col span={18}>
          <Text style={{ fontSize: "12px" }}>
            {data["enrichment"]?.["virustotal"] !== undefined &&
            data["enrichment"]["virustotal"] !== -1 ? (
              <a
                href={`https://www.virustotal.com/gui/file/${data.scan.hash.sha256}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data["enrichment"]?.["virustotal"]} Positives
              </a>
            ) : (
              <a
                href={`https://www.virustotal.com/gui/file/${data.scan.hash.sha256}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Not Found
              </a>
            )}
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default FileOverviewCard;

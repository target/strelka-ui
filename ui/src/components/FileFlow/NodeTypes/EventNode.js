import { useState, memo } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { CameraOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Tag, Tooltip } from "antd";
import { Handle, Position } from "reactflow";
import { getIconConfig } from "../../../utils/iconMappingTable";

// Helper Functions
function lightenHexColor(hexColor, factor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const newR = Math.round(r + (255 - r) * factor)
    .toString(16)
    .padStart(2, "0");
  const newG = Math.round(g + (255 - g) * factor)
    .toString(16)
    .padStart(2, "0");
  const newB = Math.round(b + (255 - b) * factor)
    .toString(16)
    .padStart(2, "0");

  return `#${newR}${newG}${newB}`;
}

function getVirusTotalColor(virusTotalResponse) {
  if (typeof virusTotalResponse === "number") {
    if (virusTotalResponse > 5) {
      return "error";
    } else if (virusTotalResponse === -1) {
      return "default";
    } else if (virusTotalResponse === -3) {
      return "warning";
    } else {
      return "success";
    }
  }
  return "default";
}

function getVirusTotalStatus(virusTotalResponse) {
  if (typeof virusTotalResponse === "number") {
    if (virusTotalResponse === -1) {
      return "Not Found on VirusTotal";
    } else if (virusTotalResponse === -3) {
      return "Exceeded VirusTotal Limit";
    } else if (virusTotalResponse > 5) {
      return virusTotalResponse + " Positives";
    } else {
      return "Benign";
    }
  }
  return "Not Found on VirusTotal";
}

// Styled Components
const QrCodePreviewWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: ${({ hasImage }) => (hasImage ? "40px" : "10px")};
  width: 24px;
  height: 24px;
  border-radius: 20%;
  background-color: #ff7a45;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const PulsatingAnimation = createGlobalStyle`
  @keyframes pulsate {
    0% {
      box-shadow: 0 0 5px rgba(255,0,0,0.4);
    }
    50% {
      box-shadow: 0 0 20px rgba(255,0,0,0.6), 0 0 30px rgba(255,0,0,0.8);
    }
    100% {
      box-shadow: 0 0 5px rgba(255,0,0,0.4);
    }
  }
`;

const ImagePreviewWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 20%;
  background-color: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const ImageTooltip = styled(Tooltip)`
  .ant-tooltip-inner {
    max-width: 100%;
    max-height: 100%
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    overflow: hidden; 
  }
  .ant-tooltip-inner img {
    pointer-events: auto;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

const TagWrapper = styled.div`
  display: inline-block;
  margin-right: 10px;
  position: absolute;
  top: -15px;
  z-index: 10;
  letter-spacing: 0.5px;
`;

const VirustotalWrapper = styled.div`
  position: absolute;
  top: -15px;
  right: -10px;
  z-index: 10;
  letter-spacing: 0.5px;
`;

const NodeWrapper = styled.div`
  position: relative;
  width: 450px;
  height: 100px;
  border-radius: 8px;
  ${(props) =>
    props.$nodeAlert &&
    `
  animation: pulsate 2s infinite;
`}
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.06),
    0px 3px 4px 0px rgba(0, 0, 0, 0.06), 0px 1px 8px 0px rgba(0, 0, 0, 0.06),
    ${(props) =>
    props.$glow
      ? `0px 0px 10px 5px ${lightenHexColor(props.$bgColor || "#91caff", 0.5)}`
      : "0px 1px 8px 0px rgba(0, 0, 0, 0.06)"}; // Glow effect for selected nodes
  background: #fff;
  padding: 8px 10px;
  display: flex;
  align-items: center;
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid #aaa; /* Arrow color */
  position: absolute;
  left: -10px; /* Adjust as needed */
  top: 50%;
  transform: translateY(-50%);
`;

const LeftWrapper = styled.div`
  width: 44px;
  height: 44px;
  background-color: ${({ $bgColor }) => $bgColor || "#91caff"};
  border-radius: 6px;
  flex: 0 0 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  p {
    color: #ffffff;
    text-transform: uppercase;
    font-size: min(max(12px, 4vw), 14px);
    letter-spacing: 1px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const RightWrapper = styled.div`
  flex: 1 1 auto;
  text-align: left;
  margin-left: 12px;
  p {
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 500;
  }
  .node-header {
    text-transform: uppercase;
    color: #999094;
    font-size: 11px;
    letter-spacing: 2px;
    line-height: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 450px;
  }
  .node-label {
    color: #3d3a3b;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 375px;
  }
  .node-sub {
    color: ${({ $acColor }) => $acColor};
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.1px;
    font-weight: 400;
  }
  .node-groups {
    line-height: 1.2;
    margin-top: 3px;
  }
`;

// -------------------------
// Main Component
// -------------------------

const EventNode = memo(({ data, selected }) => {
  // Initialize isBlurred based on the presence of data.nodeQrData
  const [isBlurred, setIsBlurred] = useState(!!data.nodeQrData);

  // Example of conditional styling for blur effect
  const previewStyle = isBlurred ? { filter: "blur(4px)" } : {};

  const handleStyle = {
    backgroundColor: "#aaa",
    width: 12,
    height: 12,
    borderRadius: 12,
    border: `1px solid bbb`,
  };

  const mappingEntry = getIconConfig("strelka", data.nodeMain.toLowerCase());
  const IconComponent = mappingEntry?.icon;
  const color = mappingEntry?.color || data.color;
  const hasImage = Boolean(data.nodeImage);
  const virusTotalResponse = data.nodeVirustotal;
  const tlshResponse = data.nodeTlshData.family;

  data.nodeAlert =
    typeof virusTotalResponse === "number" && virusTotalResponse > 5;

  return (
    <NodeWrapper $glow={selected} $bgColor={color} $nodeAlert={data.nodeAlert}>
      {<PulsatingAnimation />}
      {data.nodeIocs && (
        <TagWrapper style={{ left: "-5px" }}>
          <Tag color="purple">
            <strong>Potential IOCs: {data.nodeIocs}</strong>
          </Tag>
        </TagWrapper>
      )}
      {data.nodeInsights && (
        <TagWrapper style={{ left: data.nodeIocs ? "135px" : "-5px" }}>
          <Tag color="blue">
            <strong>Insights: {data.nodeInsights}</strong>
          </Tag>
        </TagWrapper>
      )}
      {data.nodeDepth !== 0 && (
        <>
          <Arrow />
          <Handle
            type="target"
            position={Position.Left}
            style={{
              border: "None",
              background: "None",
              bottom: "10%",
              transform: "translate(30%, -50%)",
            }}
          />
        </>
      )}
      <LeftWrapper $bgColor={color}>
        {IconComponent ? (
          <IconComponent style={{ color: "#ffffff", fontSize: "36px" }} />
        ) : (
          <p>{data.nodeMain}</p>
        )}
      </LeftWrapper>
      <RightWrapper $acColor={"#999094"}>
        <p className="node-header">{data.nodeMain}</p>
        <p className="node-label">{data.nodeLabel}</p>
        <p className="node-sub">{data.nodeSub}</p>
        <div className="node-groups">
          <Tag color="default">
            {data.nodeMetric} {data.nodeMetricLabel}
          </Tag>
          {tlshResponse && (
            <Tag
              style={{
                margin: "2px",
                fontWeight: "500",
                fontSize: "11px",
              }}
              color="red"
            >
              TLSH Related Match:{" "}
              {`${tlshResponse.slice(0, 10)}${
                tlshResponse.length > 10 ? "..." : ""
              }`}
            </Tag>
          )}
        </div>
      </RightWrapper>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          ...handleStyle,
          bottom: "10%",
          transform: "translate(30%, -50%)",
        }}
      />
      <VirustotalWrapper>
        <Tag color={getVirusTotalColor(data.nodeVirustotal)}>
          <b>{getVirusTotalStatus(data.nodeVirustotal)}</b>
        </Tag>
      </VirustotalWrapper>
      {data.nodeQrData && (
        <Tooltip title="QR Code found">
          <QrCodePreviewWrapper hasImage={hasImage}>
            <QrcodeOutlined style={{ color: "white" }} />
          </QrCodePreviewWrapper>
        </Tooltip>
      )}
      {data.nodeImage && (
        <ImageTooltip
          color="white"
          placement="left"
          title={
            <PreviewImage
              src={`data:image/jpeg;base64,${data.nodeImage}`}
              alt="Image Preview"
              style={previewStyle}
            />
          }
        >
          <ImagePreviewWrapper>
            <CameraOutlined style={{ color: "white" }} />
          </ImagePreviewWrapper>
        </ImageTooltip>
      )}
    </NodeWrapper>
  );
});

export default EventNode;

import React, { useState, useEffect } from "react";
import { Collapse, Tag, Typography } from "antd";
import TlshOverviewCard from "./TlshOverviewCard";

const { Text } = Typography;

const FileTlshLanding = ({ selectedNodeData, expandAll }) => {
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(expandAll ? ["1"] : []);
  }, [expandAll]);

  const tlshData = selectedNodeData?.scan?.tlsh?.match;

  const getTlshRating = (score) => {
    if (score <= 30) return { label: "Very Similar", color: "red" };
    if (score <= 60) return { label: "Somewhat Similar", color: "volcano" };
    if (score <= 120) return { label: "Moderately Different", color: "orange" };
    if (score <= 180) return { label: "Quite Different", color: "gold" };
    return { label: "Very Different", color: "green" };
  };

  return tlshData ? (
    <Collapse
      defaultActiveKey={[]}
      activeKey={activeKey}
      onChange={setActiveKey}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Collapse.Panel
        header={
          <div style={{ marginLeft: "8px" }}>
            <Text strong>TLSH Related Match</Text>
            <div style={{ float: "right" }}>
              <Tag color={getTlshRating(tlshData.score).color}>
                <b>{getTlshRating(tlshData.score).label}</b>
              </Tag>
            </div>
          </div>
        }
        key="1"
      >
        <TlshOverviewCard data={selectedNodeData} />
      </Collapse.Panel>
    </Collapse>
  ) : null;
};

export default FileTlshLanding;

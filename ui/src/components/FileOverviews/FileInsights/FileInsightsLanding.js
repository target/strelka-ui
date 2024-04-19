import React, { useState, useEffect } from "react";
import { Collapse, Tag, Typography } from "antd";
import InsightsCard from './FileInsightsOverviewCard';

const { Text } = Typography;

const InsightsLanding = ({ selectedNodeData, expandAll }) => {
    const insightsData = selectedNodeData?.insights || [];
    const [activeKey, setActiveKey] = useState([]);

    useEffect(() => {
      setActiveKey(expandAll ? ["1"] : []);
    }, [expandAll]);

    return (
      <Collapse
        activeKey={activeKey}
        onChange={(keys) => setActiveKey(keys)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <Collapse.Panel
          header={
            <div>
              <Text strong>Insights</Text>
              <div style={{ float: "right" }}>
                <Tag color="default">
                  <b>Matches: {insightsData.length}</b>
                </Tag>
              </div>
            </div>
          }
          key="1"
        >
          <InsightsCard data={insightsData} />
        </Collapse.Panel>
      </Collapse>
    );
};

export default InsightsLanding;

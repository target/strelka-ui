import React, { useState, useEffect } from "react";
import { Collapse, Tag, Typography } from "antd";
import YaraOverviewCard from './YaraOverviewCard'; 

const { Text } = Typography;

const YaraOverviewLanding = ({ selectedNodeData, expandAll }) => {
    const yaraMatches = selectedNodeData?.scan?.yara?.matches || [];
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
              <Text strong>YARA Signatures</Text>
              <div style={{ float: "right" }}>
                <Tag color="default">
                  <b>Matches: {yaraMatches.length}</b>
                </Tag>
              </div>
            </div>
          }
          key="1"
        >
          {yaraMatches.length > 0 ? (
            <YaraOverviewCard data={selectedNodeData} />
          ) : (
            "No YARA Matches"
          )}
        </Collapse.Panel>
      </Collapse>
    );
};

export default YaraOverviewLanding;

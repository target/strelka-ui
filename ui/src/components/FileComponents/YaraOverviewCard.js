import React, { useState } from "react";
import { Typography, List, Tag, Input, Row, Col } from "antd";

const { Text, Paragraph } = Typography;

const YaraOverviewCard = ({ data }) => {
  const [filter, setFilter] = useState("");

  const antColors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
    "grey",
  ];

  // Function to randomly get a color for a given prefix
  const getColorForPrefix = (prefix) => {
    const randomIndex = Math.floor(Math.random() * antColors.length);
    return antColors[randomIndex];
  };

  // Keep track of assigned colors for each prefix
  const prefixColorMap = {};

  // Function to get a consistent color for a given prefix
  const getConsistentColorForPrefix = (prefix) => {
    if (!prefixColorMap[prefix]) {
      prefixColorMap[prefix] = getColorForPrefix(prefix);
    }
    return prefixColorMap[prefix];
  };

  const mapDescriptions = () => {
    const descriptionMap = new Map();
    if (
      data &&
      data.scan &&
      data.scan.yara &&
      Array.isArray(data.scan.yara.meta)
    ) {
      data.scan.yara.meta.forEach((meta) => {
        if (meta.identifier === "description") {
          descriptionMap.set(meta.rule, meta.value);
        }
      });
    }
    return descriptionMap;
  };

  const compileRulesList = () => {
    const descriptionMap = mapDescriptions();
    if (
      data &&
      data.scan &&
      data.scan.yara &&
      Array.isArray(data.scan.yara.matches)
    ) {
      return data.scan.yara.matches
        .map((rule) => {
          return {
            rule: rule,
            description:
              descriptionMap.get(rule) || "No description available.",
            color: getConsistentColorForPrefix(rule.split("_")[0]),
          };
        })
        .sort((a, b) => a.rule.localeCompare(b.rule)); // Sort alphabetically by rule name
    } else {
      return []; // Return an empty array if the data is not in the expected format
    }
  };

  // Function to filter YARA data
  const processYaraData = () => {
    return compileRulesList().filter(({ rule, description }) => {
      const searchTerm = filter.toLowerCase();
      return (
        !filter ||
        rule.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm)
      );
    });
  };

  const yaraData = processYaraData();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Filter"
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />
        </Col>
      </Row>

      <List
        dataSource={yaraData}
        renderItem={(item) => (
          <List.Item
            style={{
              border: "None",
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              paddingBottom: "4px",
              paddingTop: "4px",
              height: "100%",
            }}
          >
            <Tag
              style={{
                flexGrow: 1,
                display: "flex",
                padding: "8px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              color={item.color}
            >
              <Text strong style={{ fontSize: "12px", paddingRight: "10px" }}>
                {item.rule}
              </Text>
              <Paragraph
                ellipsis={{ rows: 1, expandable: true }}
                style={{ margin: 0, textAlign: "right", fontSize: "12px" }}
              >
                {item.description}
              </Paragraph>
            </Tag>
          </List.Item>
        )}
        style={{ maxHeight: "200px", overflowY: "scroll" }}
      />
    </div>
  );
};

export default YaraOverviewCard;

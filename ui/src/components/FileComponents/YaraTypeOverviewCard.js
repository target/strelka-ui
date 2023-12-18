import React from "react";
import { Badge, Tooltip, Typography, Row, Col } from "antd";

const { Text } = Typography;

const colors = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime',
];

const YaraTypeOverviewCard = ({ data }) => {
  // Create an object to hold the count of YARA matches
  const yaraCounts = {};

  // Iterate over the strelka_response to populate yaraCounts
  data.strelka_response.forEach((response) => {
    const yaraMatches = response.scan?.yara?.matches || [];
    yaraMatches.forEach((match) => {
      if (yaraCounts[match]) {
        yaraCounts[match].count++;
        yaraCounts[match].files.push(response.file.name);
      } else {
        yaraCounts[match] = { count: 1, files: [response.file.name] };
      }
    });
  });

  // Convert the object to an array and sort descending by count
  const yaraData = Object.entries(yaraCounts)
    .map(([yara, details]) => ({
      yara,
      count: details.count,
      files: details.files,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      {yaraData.map((item, index) => (
        <Row key={index} align="middle" style={{ marginBottom: "8px" }}>
          <Col span={18}>
            <Tooltip placement="topLeft" title={item.files.join(', ')}>
              <Badge color={item.color} />
              <Text
                style={{
                  marginLeft: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                }}
              >
                {item.yara}
              </Text>
            </Tooltip>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Text>{item.count}</Text>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default YaraTypeOverviewCard;

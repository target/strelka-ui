import React from "react";

import { Layout, Typography } from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;

const PageWrapper = ({ children, title, subtitle }) => {
  return (
    <div style={{ margin: "40px", textAlign: "left" }}>
      <Typography>
        <Title>{title}</Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </Typography>
      <Content style={{ minHeight: "calc(100vh - 134px" }}>{children}</Content>
    </div>
  );
};

export default PageWrapper;

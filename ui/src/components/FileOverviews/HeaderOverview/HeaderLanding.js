// FileOverviews/FileHeaderOverview/FileHeaderOverviewLanding.js
import React from 'react';
import { Row, Col } from 'antd';
import FileHeaderOverviewCard from './HeaderOverviewCard';  

const FileHeaderOverviewLanding = ({ data, onOpenVT }) => {
  return (
    <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}>
      <Col xs={24} sm={24} md={24} lg={24} style={{ paddingRight: "0px" }}>
        <FileHeaderOverviewCard data={data} onOpenVT={onOpenVT} />
      </Col>
    </Row>
  );
};

export default FileHeaderOverviewLanding;

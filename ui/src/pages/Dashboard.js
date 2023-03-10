import React, { useEffect, useState } from "react";

import { Row, Col, Card, Input, Statistic, Typography, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import PageWrapper from "../components/PageWrapper";
import SubmissionTable from "../components/SubmissionTable";
import Dropzone from "../components/Dropzone";
import { APP_CONFIG } from "../config";
import { fetchWithTimeout } from "../util";

const { Title, Text } = Typography;

const DashboardPage = (props) => {
  const [fileDescription, setFileDescription] = useState(
    "No Description Provided"
  );
  const [filesUploaded, setFilesUploaded] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    all_time: 0,
    thirty_days: 0,
    seven_days: 0,
    twentyfour_hours: 0,
  });

  const setDescription = (event) => {
    setFileDescription(event.target.value);
  };

  useEffect(() => {
    let mounted = true;
    setLoadingStats(true);

    fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/scans/stats`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      timeout: APP_CONFIG.API_TIMEOUT,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          if (mounted) {
            setStats(data);
          }
        }
      })
      .finally(() => {
        setLoadingStats(false);
      });

    return function cleanup() {
      mounted = false;
    };
  }, [filesUploaded]);

  const uploadProps = {
    name: "file",
    multiple: true,
    data: { description: fileDescription },
    withCredentials: true,
    action: `${APP_CONFIG.BACKEND_URL}/strelka/upload`,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setFilesUploaded(filesUploaded + 1);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  return (
    <PageWrapper title="Dashboard">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col key="all-time-stat" className="gutter-row" xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="File submissions all time"
              value={stats.all_time}
              loading={loadingStats}
            />
          </Card>
        </Col>
        <Col key="month-stat" className="gutter-row" xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="File submissions in the last 30 days"
              value={stats.thirty_days}
              loading={loadingStats}
            />
          </Card>
        </Col>
        <Col key="week-stat" className="gutter-row" xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="File submissions in the last 7 days"
              value={stats.seven_days}
              loading={loadingStats}
            />
          </Card>
        </Col>
        <Col key="today-stat" className="gutter-row" xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="File submissions in the last 24 hours"
              value={stats.twentyfour_hours}
              loading={loadingStats}
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={8}>
          <Card>
            <Typography>
              <Title level={3}>Upload File</Title>
              <Text type="secondary">
                Drop a file below and add a description to start a Strelka Scan.
              </Text>
            </Typography>
            <br />
            <Input
              onChange={setDescription}
              placeholder="Description to be saved with submission..."
              prefix={<MessageOutlined />}
            />
            <br />
            <br />
            <Dropzone height="200px" {...uploadProps} />
          </Card>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={16}>
          <Card>
            <Typography>
              <Title level={3}>Recent Submissions</Title>
            </Typography>
            <SubmissionTable page_size={5} filesUploaded={filesUploaded} />
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default DashboardPage;

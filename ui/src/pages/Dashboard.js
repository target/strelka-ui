import React, { useEffect, useState } from "react";

import { Row, Col, Card, Input, Statistic, Typography, message } from "antd";
import { CalendarOutlined, MessageOutlined } from "@ant-design/icons";
import PageWrapper from "../components/PageWrapper";
import SubmissionTable from "../components/SubmissionTable";
import VirusTotalUploader from "../components/FileComponents/VirusTotalUploader";
import MimeTypeBarChart from "../components/FileComponents/MimeTypeBarChart";
import Dropzone from "../components/Dropzone";
import { APP_CONFIG } from "../config";
import { fetchWithTimeout } from "../util";

const { Title, Text } = Typography;

const statisticCardStyle = {
  borderRadius: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  height: '100%',
};


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
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setFilesUploaded(filesUploaded + 1);
      } else if (info.file.status === "error") {
        message.error(`${info.file.response.details}`);
      }
    },
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  return (
    <PageWrapper>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={statisticCardStyle}>
            <Statistic
              title="All Time Submissions"
              value={stats.all_time}
              loading={loadingStats}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={statisticCardStyle}>
            <Statistic
              title="Last 30 Days"
              value={stats.thirty_days}
              loading={loadingStats}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={statisticCardStyle}>
            <Statistic
              title="Last 7 Days"
              value={stats.seven_days}
              loading={loadingStats}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#125ecf' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={statisticCardStyle}>
            <Statistic
              title="Last 24 Hours"
              value={stats.twentyfour_hours}
              loading={loadingStats}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#cf8512' }}
            />
          </Card>
        </Col>
      </Row>
      <br />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" xs={8} sm={8} md={8} lg={8}>
          <Card>
            <Typography>
              <Title style={{ marginTop: "0", paddingTop: "0" }} level={3}>
                Upload Via VirusTotal
              </Title>
              <Text type="secondary">
                Input a SHA256 hash to analyze a file from VirusTotal.
              </Text>
            </Typography>
            <br />
            <VirusTotalUploader
              onUploadSuccess={() => setFilesUploaded(filesUploaded + 1)}
            />
          </Card>
          <br />
          <Card>
            <Typography>
              <Title style={{ marginTop: "0", paddingTop: "0" }} level={3}>
                Upload File
              </Title>
              <Text type="secondary">
                Drop a file below to upload to Strelka.
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
            <Dropzone {...uploadProps} />
          </Card>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={16} lg={16}>
          <Card style={{ fontsize: "10px" }}>
            <Typography>
              <Title style={{ marginTop: "0", paddingTop: "0" }} level={3}>
                Submission Statistics
              </Title>
            </Typography>
            <MimeTypeBarChart height={529} />
          </Card>
        </Col>

        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
          <br />

          <Card>
            <Typography>
              <Title style={{ marginTop: "0", paddingTop: "0" }} level={3}>
                Analysis Submissions
              </Title>
            </Typography>
            <SubmissionTable
              key={filesUploaded}
              page_size={10}
              filesUploaded={filesUploaded}
            />{" "}
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default DashboardPage;

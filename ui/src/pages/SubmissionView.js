import React, { useState, useEffect, useContext } from "react";
import ReactJson from "react-json-view";
import { useParams } from "react-router-dom";

import {
  PageHeader,
  Button,
  Descriptions,
  Tag,
  Row,
  Col,
  Card,
  List,
  Typography,
  Spin,
  message,
} from "antd";

import PageWrapper from "../components/PageWrapper";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ScanDisplayCard from "../components/ScanDisplayCard";
import { APP_CONFIG } from "../config";
import AuthCtx from "../contexts/auth";
import { fetchWithTimeout } from "../util";

const { Title, Text } = Typography;

const SubmissionsPage = (props) => {
  const { handle401 } = useContext(AuthCtx);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  const { id } = useParams();

  useEffect(() => {
    let mounted = true;

    fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/scans/${id}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      timeout: APP_CONFIG.API_TIMEOUT,
    })
      .then((res) => {
        if (mounted) {
          if (res.status === 401) {
            handle401();
          }
        }
        return res.json();
      })
      .then((res) => {
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, [id]);

  const copyRecord = () => {
    navigator.clipboard.writeText(JSON.stringify(data.strelka_response));
    message.success("Value copied to clipboard!");
  };

  const FormatListItemName = (item) => {
    return item
      .split("_")
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(" ");
  };

  return isLoading ? (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Spin
        size="large"
        style={{
          display: "flex",
          alignSelf: "center",
        }}
      />
    </div>
  ) : (
    <PageWrapper title="Strelka Scan Results">
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={data.file_name}
        subTitle={data.mime_types.map((type) => (
          <Tag style={{ marginBottom: "4px" }} key={type}>
            {type}
          </Tag>
        ))}
        extra={[
          <Button key="1" onClick={copyRecord}>
            Copy record as JSON
          </Button>,
        ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Submitted by">
            {data.user.user_cn}
          </Descriptions.Item>
          <Descriptions.Item label="Creation Time">
            <p>
              {data.submitted_at
                ? new Date(data?.submitted_at).toUTCString()
                : ""}{" "}
            </p>
          </Descriptions.Item>
          <Descriptions.Item label="Scan Time">
            <p>
              {data?.processed_at
                ? new Date(data?.processed_at).toUTCString()
                : ""}{" "}
            </p>
          </Descriptions.Item>
          <Descriptions.Item label="Scanners Run">
            <div>
              {data?.scanners_run?.map((tag) => {
                return (
                  <Tag style={{ marginBottom: "4px" }} key={tag}>
                    {tag.toUpperCase().substring(0, 4) === "SCAN"
                      ? tag.toUpperCase().substring(4)
                      : tag}
                  </Tag>
                );
              })}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="YARA Hits">
            <div>
              {data?.strelka_response?.scan_yara.matches.map((type) => (
                <Tag style={{ marginBottom: "4px" }} key={type}>
                  {type}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <br />

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
          <Card>
            <Typography>
              <Title level={3}>Request Attributes</Title>
              <Text type="secondary">
                Metadata associated with the scan request.
              </Text>
            </Typography>
            <br />

            <List
              bordered
              dataSource={Object.entries(
                data.strelka_response.request.attributes.metadata
              )}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <CopyToClipboard
                      text={item}
                      onCopy={() =>
                        message.success("Value copied to clipboard!")
                      }
                    >
                      <a key="list-copy">Copy</a>
                    </CopyToClipboard>,
                  ]}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "calc(100% - 100px)",
                      flexDirection: "column",
                      wordWrap: "break-word",
                    }}
                  >
                    <div>
                      <b>{FormatListItemName(item[0])}:</b>
                    </div>
                    <div>{item[1]}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <br />

          <Card style={{ width: "100%" }}>
            <Typography>
              <Title level={3}>Scan Results</Title>
              <Text type="secondary">Results of named scans</Text>
            </Typography>
            <br />

            <List
              bordered
              dataSource={data?.scanners_run}
              renderItem={(scanner_name) => {
                return (
                  <List.Item
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <ScanDisplayCard
                      scanner_name={scanner_name}
                      data={data.strelka_response}
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        <Col className="gutter-row" xs={24} sm={24} md={16} lg={16}>
          <Row>
            <Card style={{ width: "100%" }}>
              <Typography>
                <Title level={3}>JSON View</Title>
                <Text type="secondary">Raw response JSON data</Text>
              </Typography>
              <br />
              <ReactJson src={data} />
            </Card>
          </Row>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default SubmissionsPage;

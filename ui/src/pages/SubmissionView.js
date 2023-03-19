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
  Select,
  Spin,
  Tooltip,
  message,
} from "antd";

import { QuestionCircleOutlined } from "@ant-design/icons";

import PageWrapper from "../components/PageWrapper";
import { CopyToClipboard } from "react-copy-to-clipboard";

import ScanDisplayCard from "../components/ScanDisplayCard";
import { APP_CONFIG } from "../config";
import AuthCtx from "../contexts/auth";
import { fetchWithTimeout } from "../util";

const { Title, Text } = Typography;

const SubmissionsPage = (props) => {
  const { handle401 } = useContext(AuthCtx);

  const { Option } = Select;
  const [FilenameView, setFileNameView] = useState("");
  const [FiledepthView, setFileDepthView] = useState("");
  const [hideMetadata, setHideMetadata] = useState(true);
  const [showAll, setShowAll] = useState(true);

  const getFilteredData = () => {
    let filteredData = { ...data };
    if (hideMetadata) {
      const filteredKeys = Object.keys(filteredData).filter(
        (key) => key !== "strelka_response"
      );
      filteredKeys.forEach((key) => {
        delete filteredData[key];
      });
    }

    if (showAll) {
      return {
        strelka_response: filteredData.strelka_response,
        ...filteredData,
      };
    }

    const filteredResponse = [];
    for (let i = 0; i < filteredData.strelka_response.length; i++) {
      const item = filteredData.strelka_response[i];
      if (
        item.file.name === FilenameView &&
        item.file.depth === FiledepthView
      ) {
        filteredResponse.push(item);
        break; // exit the loop once the conditions are met
      }
    }
    filteredData.strelka_response = filteredResponse;

    const strelka_response = filteredData.strelka_response;
    delete filteredData.strelka_response;
    return { strelka_response, ...filteredData };
  };

  const handleEventView = (value, depth) => {
    setFileNameView(depth.children[3]);
    setFileDepthView(depth.children[1]);
  };

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
          setFileNameView(res.strelka_response[0].file.name);
          setFileDepthView(res.strelka_response[0].file.depth);
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, [handle401, id]);

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
          APP_CONFIG.SEARCH_URL && APP_CONFIG.SEARCH_NAME && (
            <a
              key="1"
              href={`${APP_CONFIG.SEARCH_URL}`.replace(
                "<REPLACE>",
                data.file_id
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Button>{APP_CONFIG.SEARCH_NAME}</Button>
            </a>
          ),

          <CopyToClipboard
            text={JSON.stringify(data.strelka_response)}
            onCopy={() => message.success("Event copied to clipboard!")}
          >
            <Button key="2">Copy record as JSON</Button>
          </CopyToClipboard>,
        ]}
      >
        <Descriptions bordered size="small" column={3}>
          <Descriptions.Item label="Submitted by">
            {data.user.user_cn}
          </Descriptions.Item>
          <Descriptions.Item label="Upload Description">
            <div>{data.submitted_description}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Files Analyzed">
            <div>{data.strelka_response.length}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Creation Time">
            <p>
              {data.submitted_at
                ? new Date(data?.submitted_at).toISOString().split(".")[0] + "Z"
                : ""}{" "}
            </p>
          </Descriptions.Item>
          <Descriptions.Item label="Scan Time">
            <p>
              {data?.processed_at
                ? new Date(data?.processed_at).toISOString().split(".")[0] + "Z"
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
              {data?.strelka_response[0]?.scan?.[
                "scan_yara" in data.strelka_response[0] ? "scan_yara" : "yara"
              ].matches.map((type) => (
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
                data.strelka_response[0].request.attributes.metadata
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

          <Card>
            <Typography>
              <Title level={3}>Display Results</Title>
              <Text type="secondary">Options for displaying events.</Text>
            </Typography>
            <br />

            <List bordered>
              <List.Item>
                <div>
                  <div style={{ paddingBottom: "8px" }}>
                    <b>{FormatListItemName("Metadata Display")}</b>
                  </div>
                  <Button
                    onClick={() => setHideMetadata(!hideMetadata)}
                    style={{ marginBottom: "8px" }}
                  >
                    {hideMetadata ? "Show Metadata" : "Hide Metadata"}
                  </Button>
                </div>
              </List.Item>
              <List.Item>
                <div>
                  <div style={{ paddingBottom: "8px" }}>
                    <b>{FormatListItemName("Event Display")}</b>
                  </div>

                  <Button onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Specific Event Display" : "Show All Events"}
                  </Button>
                </div>
              </List.Item>

              <List.Item
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ alignItems: "center" }}>
                  <div style={{ paddingBottom: "8px" }}>
                    <b>{FormatListItemName("Display Specific Scans")}</b>
                    {showAll && (
                      <Tooltip title="Must change above to Specific Event Display">
                        <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    )}
                  </div>
                  <Select
                    disabled={showAll}
                    id="expandSelect"
                    defaultValue="Select Filename"
                    style={{
                      width: "250px",
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onChange={(FilenameView, FiledepthView) =>
                      handleEventView(FilenameView, FiledepthView)
                    }
                    value={FilenameView}
                  >
                    {data.strelka_response.map((event) => (
                      <Option
                        on
                        key={event.file.name + event.file.depth}
                        value={event.file.name + event.file.depth}
                      >
                        Depth: {event.file.depth} - {event.file.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </List.Item>
            </List>
          </Card>

          <br />

          <Card style={{ width: "100%" }}>
            <Typography>
              <Title level={3}>Scan Results</Title>
              <Text type="secondary">
                Results of named scans for the submitted file
              </Text>
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
                      data={data.strelka_response[0]}
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

              <ReactJson
                src={getFilteredData()}
                collapsed={3}
                shouldCollapse={(field) => {
                  if (field.name === "scan") {
                    return false;
                  }
                  if (
                    typeof field.src !== "object" ||
                    Array.isArray(field.src)
                  ) {
                    return false;
                  }
                  return field.level > 2;
                }}
              />
            </Card>
          </Row>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default SubmissionsPage;

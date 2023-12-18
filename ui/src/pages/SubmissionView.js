import React, { useState, useEffect, useContext } from "react";
import ReactJson from "react-json-view";
import { useParams } from "react-router-dom";
import { Tag, Row, Col, Collapse, Typography, Spin } from "antd";

import PageWrapper from "../components/PageWrapper";
import FileTreeCard from "../components/FileComponents/FileTreeCard";
import FileHeaderOverviewCard from "../components/FileComponents/FileHeaderOverviewCard";
import FileTypeOverviewCard from "../components/FileComponents/FileTypeOverviewCard";
import YaraTypeOverviewCard from "../components/FileComponents/YaraTypeOverviewCard";
import FileOverviewCard from "../components/FileComponents/FileOverviewCard";
import YaraOverviewCard from "../components/FileComponents/YaraOverviewCard";
import OcrOverviewCard from "../components/FileComponents/OcrOverviewCard";
import FileHeaderFooterCard from "../components/FileComponents/FileHeaderFooterCard";
import FileExiftoolCard from "../components/FileComponents/ExiftoolOverviewCard";
import IocOverviewCard from "../components/FileComponents/IocOverviewCard";
import PeOverviewCard from "../components/FileComponents/PeOverviewCard";
import InsightsCard from "../components/FileComponents/InsightsCard";
import FileHighlightsOverviewCard from "../components/FileComponents/FileHighlightsOverviewCard";

import { getIconConfig } from "../utils/iconMappingTable";

import { APP_CONFIG } from "../config";
import AuthCtx from "../contexts/auth";
import { fetchWithTimeout } from "../util";

import "../styles/IconContainer.css";

const { Text } = Typography;

/**
 * SubmissionsPage component to display strelka scan results
 * @returns JSX.Element
 */
const SubmissionsPage = (props) => {
  const { handle401 } = useContext(AuthCtx);
  const [FilenameView, setFileNameView] = useState("");
  const [FiledepthView, setFileDepthView] = useState("");
  const [hideMetadata] = useState(true);
  const [showAll] = useState(true);
  const [selectedNodeData, setSelectedNodeData] = useState("");

  const handleNodeSelect = (nodeData) => {
    setSelectedNodeData(nodeData);
  };

  const getFileIcon = () => {
    const mappingEntry = getIconConfig(
      "strelka",
      selectedNodeData["file"]["flavors"]["mime"][0].toLowerCase()
    );
    const IconComponent = mappingEntry?.icon;
    const bgColor = mappingEntry?.color || "defaultBackgroundColor";

    // Return a JSX element with the container class
    return (
      <div className="file-overview-box" style={{ backgroundColor: bgColor }}>
        {IconComponent ? <IconComponent style={{ fontSize: "24px" }} /> : null}
      </div>
    );
  };

  const getFileDisposition = () => {
    const virustotalPositives = selectedNodeData["enrichment"]?.["virustotal"];
    let disposition = "";
    let color = "";

    if (virustotalPositives || virustotalPositives === 0) {
      if (typeof virustotalPositives === "number") {
        if (virustotalPositives === -1) {
          disposition = "Not Found on VirusTotal";
          color = "default";
        } else if (virustotalPositives === -2) {
          disposition = "VirusTotal Not Enabled";
          color = "default";
        } else if (virustotalPositives > 5) {
          disposition = "Malicious";
          color = "error";
        } else {
          disposition = "Benign";
          color = "success";
        }
      }
    } else {
      disposition = "Not Found on VirusTotal";
      color = "default";
    }
    return {
      tag: (
        <Tag color={color}>
          <b>{disposition}</b>
        </Tag>
      ),
      text: disposition,
    };
  };

  const getFilteredData = () => {
    let filteredData = "";
    if (selectedNodeData) {
      filteredData = { ...selectedNodeData };
      filteredData = { strelka_response: filteredData };
    } else {
      filteredData = { ...data };
    }
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
    <PageWrapper>
      <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}>
        <Col
          className="gutter-row"
          xs={24}
          sm={24}
          md={24}
          lg={24}
          style={{ paddingRight: "0px" }}
        >
          <FileHeaderOverviewCard data={data} />
        </Col>
      </Row>
      <br />

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" xs={6} sm={6} md={6} lg={6}>
          <Collapse
            defaultActiveKey={[1]}
            style={{ width: "100%", marginBottom: "10px", borderRadius: "20px" }}
          >
            <Collapse.Panel header="Submission Highlights" key="1">
              <FileHighlightsOverviewCard data={data} />
            </Collapse.Panel>
          </Collapse>
          <Collapse
                defaultActiveKey={[1]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div style={{ marginLeft: "8px" }}>
                      <Text>Submission File Types</Text>
                      <div style={{ float: "right" }}></div>
                    </div>
                  }
                  key="1"
                >
                  <FileTypeOverviewCard data={data} />
                </Collapse.Panel>
              </Collapse>
              <Collapse
                defaultActiveKey={[1]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div style={{ marginLeft: "8px" }}>
                      <Text>Submission File YARA Matches</Text>
                      <div style={{ float: "right" }}></div>
                    </div>
                  }
                  key="1"
                >
                  <YaraTypeOverviewCard data={data} />
                </Collapse.Panel>
              </Collapse>
        </Col>

        <Col className="gutter-row" xs={24} sm={24} md={18} lg={18}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Collapse
              defaultActiveKey={[1]}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <Collapse.Panel header="Submission File Flow" key="1">
                <FileTreeCard
                  data={data.strelka_response}
                  onNodeSelect={handleNodeSelect}
                />
              </Collapse.Panel>
            </Collapse>


            {selectedNodeData && (
              <Collapse
                defaultActiveKey={[1]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {getFileIcon()}
                        <div style={{ marginLeft: "8px" }}>
                          {" "}
                          <Text strong>{selectedNodeData.file.name}</Text>
                          <div style={{ fontSize: "smaller", color: "#888" }}>
                            {selectedNodeData.file.flavors.mime[0]}
                          </div>
                        </div>
                      </div>
                      <div>{getFileDisposition().tag}</div>
                    </div>
                  }
                  key="1"
                >
                  <FileOverviewCard data={selectedNodeData} />
                </Collapse.Panel>
              </Collapse>
            )}
            {selectedNodeData && (
              <Collapse
                defaultActiveKey={[1]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div style={{ marginLeft: "8px" }}>
                      <Text strong>Insights</Text>
                      <div style={{ float: "right" }}></div>
                    </div>
                  }
                  key="1"
                >
                  <InsightsCard data={selectedNodeData?.insights} />
                </Collapse.Panel>
              </Collapse>
            )}
            {selectedNodeData && (
              <Collapse
                defaultActiveKey={[1]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div style={{ marginLeft: "8px" }}>
                      <Text strong>YARA Signatures</Text>
                      <div style={{ float: "right" }}>
                        <Tag color="default">
                          <b>
                            Matches:{" "}
                            {selectedNodeData.scan.yara.matches
                              ? selectedNodeData.scan.yara.matches.length
                              : 0}
                          </b>
                        </Tag>
                      </div>
                    </div>
                  }
                  key="1"
                >
                  {selectedNodeData.scan.yara.matches ? (
                    <YaraOverviewCard data={selectedNodeData} />
                  ) : (
                    "No YARA Matches"
                  )}
                </Collapse.Panel>
              </Collapse>
            )}

            {selectedNodeData &&
              selectedNodeData.scan.header &&
              selectedNodeData.scan.footer && (
                <Collapse
                  defaultActiveKey={[]}
                  style={{ width: "100%", marginBottom: "10px" }}
                >
                  <Collapse.Panel
                    header={
                      <div style={{ marginLeft: "8px" }}>
                        <Text strong>Header / Footer</Text>
                        <div style={{ fontSize: "smaller", color: "#888" }}>
                          Header: {selectedNodeData.scan.header.header}
                        </div>
                        <div style={{ fontSize: "smaller", color: "#888" }}>
                          Footer: {selectedNodeData.scan.footer.footer}
                        </div>
                      </div>
                    }
                    key="1"
                  >
                    <FileHeaderFooterCard data={selectedNodeData} />
                  </Collapse.Panel>
                </Collapse>
              )}
            {selectedNodeData && selectedNodeData.scan.ocr && (
              <Collapse
                defaultActiveKey={[]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginLeft: "8px" }}>
                          {" "}
                          <Text strong>Optical Character Recognition</Text>
                          <div style={{ fontSize: "smaller", color: "#888" }}>
                            {Array.isArray(selectedNodeData.scan.ocr.text)
                              ? selectedNodeData.scan.ocr.text
                                  .join(" ")
                                  .substring(0, 47) + "..."
                              : typeof selectedNodeData.scan.ocr.text ===
                                  "string" &&
                                selectedNodeData.scan.ocr.text.length > 0
                              ? selectedNodeData.scan.ocr.text.substring(
                                  0,
                                  47
                                ) + "..."
                              : "No Text"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Tag color="default">
                          <b>
                            Words Extracted:{" "}
                            {selectedNodeData.scan.ocr?.text
                              ? selectedNodeData.scan.ocr?.text.length
                              : 0}
                          </b>
                        </Tag>
                        <Tag
                          color={
                            selectedNodeData.scan.ocr?.base64_thumbnail
                              ? "success"
                              : "error"
                          }
                        >
                          <b>
                            {selectedNodeData.scan.ocr?.base64_thumbnail
                              ? "Thumbnail Available"
                              : "No Thumbnail"}
                          </b>
                        </Tag>
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <OcrOverviewCard data={selectedNodeData} />
                </Collapse.Panel>
              </Collapse>
            )}
            {selectedNodeData && selectedNodeData.scan.exiftool && (
              <Collapse
                defaultActiveKey={[]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div style={{ marginLeft: "8px" }}>
                      <Text strong>File Metadata</Text>
                      <div style={{ fontSize: "smaller", color: "#888" }}>
                        Metadata Count:{" "}
                        {Object.keys(selectedNodeData.scan.exiftool).length}
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <FileExiftoolCard data={selectedNodeData} />
                </Collapse.Panel>
              </Collapse>
            )}
            {selectedNodeData && selectedNodeData.scan.pe && (
              <Collapse
                defaultActiveKey={[]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <Text strong>Executable Information</Text>
                        <div style={{ fontSize: "smaller", color: "#888" }}>
                          Product:{" "}
                          {selectedNodeData.scan.pe?.file_info?.product_name}
                        </div>
                        <div style={{ fontSize: "smaller", color: "#888" }}>
                          Compiled: {selectedNodeData.scan.pe.compile_time}
                        </div>
                      </div>
                      <Tag
                        style={{ alignSelf: "center" }}
                        color={
                          selectedNodeData.scan.pe?.security
                            ? "success"
                            : "error"
                        }
                      >
                        <b>
                          {selectedNodeData.scan.pe?.security
                            ? "Signed"
                            : "Not Signed"}
                        </b>
                      </Tag>
                    </div>
                  }
                  key="1"
                >
                  <PeOverviewCard data={selectedNodeData} />
                </Collapse.Panel>
              </Collapse>
            )}
            {selectedNodeData && selectedNodeData.iocs && (
              <Collapse
                defaultActiveKey={[]}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                <Collapse.Panel
                  header={
                    <div style={{ marginLeft: "8px" }}>
                      <Text strong>Indicators of Compromise (IOCs)</Text>
                      <div style={{ fontSize: "smaller", color: "#888" }}>
                        {selectedNodeData.iocs[0].ioc} and{" "}
                        {selectedNodeData.iocs.length - 1} more
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <IocOverviewCard data={selectedNodeData} />
                </Collapse.Panel>
              </Collapse>
            )}
            <Collapse style={{ width: "100%" }}>
              <Collapse.Panel header={<Text strong>JSON View</Text>} key="1">
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
              </Collapse.Panel>
            </Collapse>
          </Row>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default SubmissionsPage;

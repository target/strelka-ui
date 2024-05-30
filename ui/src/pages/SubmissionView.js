import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Tag,
  Row,
  Col,
  Collapse,
  Typography,
  Spin,
  Drawer,
} from "antd";

import PageWrapper from "../components/PageWrapper";

import FileOverviewLanding from "../components/FileOverviews/FileOverview/FileOverviewLanding";
import FileHeaderLanding from "../components/FileOverviews/HeaderOverview/HeaderLanding";
import FileHighlightsOverviewLanding from "../components/FileOverviews/HighlightsOverview/HighlightsOverviewLanding";
import FileIocsOverviewLanding from "../components/FileOverviews/FileIocsOverview/FileIocsOverviewLanding";
import FileTypeOverviewLanding from "../components/FileOverviews/FileTypeOverview/FileTypeOverviewLanding";
import FileYaraOverviewLanding from "../components/FileOverviews/YaraOverview/YaraOverviewLanding";
import FileInsightsLanding from "../components/FileOverviews/FileInsights/FileInsightsLanding";
import FileYaraLanding from "../components/FileOverviews/FileYara/FileYaraLanding";
import FileTlshLanding from "../components/FileOverviews/TlshOverview/TlshLanding";
import FileHeaderFooterLanding from "../components/FileOverviews/HeaderFooterOverview/HeaderFooterLanding";
import FileIocsLanding from "../components/FileOverviews/SubmissionIocs/SubmissionIocsLanding";
import OcrOverviewLanding from "../components/FileOverviews/OcrOverview/OcrOverviewLanding";
import QrOverviewLanding from "../components/FileOverviews/QrOverview/QrOverviewLanding";
import EmailOverviewLanding from "../components/FileOverviews/EmailOverview/EmailOverviewLanding";
import XmlOverviewLanding from "../components/FileOverviews/XmlOverview/XmlOverviewLanding";
import VbOverviewLanding from "../components/FileOverviews/VbOverview/VbOverviewLanding";
import JavascriptOverviewLanding from "../components/FileOverviews/JavascriptOverview/JavascriptOverviewLanding";
import ExiftoolOverviewLanding from "../components/FileOverviews/ExiftoolOverview/ExiftoolOverviewLanding";
import PeOverviewLanding from "../components/FileOverviews/PeOverview/PeOverviewLanding";
import JsonViewLanding from "../components/FileOverviews/JsonView/JsonViewLanding";
import ZipOverviewLanding from "../components/FileOverviews/ZipOverview/ZipOverviewLanding";
import SevenZipOverviewLanding from "../components/FileOverviews/SevenZipOverview/SevenZipOverviewLanding";
import EncryptedZipOverviewLanding from "../components/FileOverviews/EncryptedZipOverview/EncryptedZipOverviewLanding";
import RarOverviewLanding from "../components/FileOverviews/RarOverview/RarOverviewLanding";


import FileTreeCardWithProvider from "../components/FileFlow/FileTreeCardWithProvider";

import VirusTotalAugmentDrawer from "../components/VirusTotal/VirusTotalAugmentDrawer";

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
  const [data, setData] = useState({});

  const [selectedNodeData, setSelectedNodeData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fileTypeFilter, setFileTypeFilter] = useState(null);
  const [fileYaraFilter, setFileYaraFilter] = useState(null);
  const [fileNameFilter, setFileNameFilter] = useState(null);
  const [fileIocFilter, setFileIocFilter] = useState(null);
  const [virusTotalDrawerOpen, setVirusTotalDrawerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const handleVirusTotalClick = (sha256Hash) => {
    setSelectedResource(sha256Hash); // Store the SHA hash for the VirusTotal drawer
    setVirusTotalDrawerOpen(true); // Open the drawer
  };

  // Callback to set file type filter
  const handleFileTypeSelect = (fileType) => {
    setFileTypeFilter(fileType);
  };

  // Callback to set file name filter
  const handleFileNameSelect = (fileName) => {
    setFileNameFilter(fileName);
  };

  // Callback to set file yara filter
  const handleFileYaraSelect = (fileYara) => {
    setFileYaraFilter(fileYara);
  };

  // Callback to set file ioc filter
  const handleFileIocSelect = (fileIoc) => {
    setFileIocFilter(fileIoc);
  };

  // Callback for selected a node in the flow view
  const handleNodeSelect = (nodeData) => {
    setSelectedNodeData(nodeData);
    setDrawerVisible(true); // Open the drawer when a node is selected
  };

  // Function to toggle all sections
  const toggleAllSections = () => {
    setExpandAll(!expandAll);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedNodeData(null); // Reset selected node data when drawer is closed
  };

  // Callback for monitoring filter changes. Need to deselect node.
  useEffect(() => {
    if (fileNameFilter) {
      // Find the node data based on the file name filter
      const nodeData = data.strelka_response.find(
        (response) => response.file.tree.node === fileNameFilter
      );
      setSelectedNodeData(nodeData || ""); // Set to found node data or reset if not found
    } else {
      // Reset selectedNodeData when other filters change
      setSelectedNodeData("");
    }
  }, [data.strelka_response, fileNameFilter, fileTypeFilter, fileYaraFilter]);

  const getFileIcon = () => {
    let flavorKey;
    if (
      selectedNodeData["file"]["flavors"]["yara"] &&
      selectedNodeData["file"]["flavors"]["yara"].length > 0
    ) {
      // Use YARA flavor if available
      flavorKey = selectedNodeData["file"]["flavors"]["yara"][0].toLowerCase();
    } else {
      // Use MIME flavor if YARA is not available
      flavorKey = selectedNodeData["file"]["flavors"]["mime"][0].toLowerCase();
    }

    const mappingEntry = getIconConfig("strelka", flavorKey);
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
        } else if (virustotalPositives === -3) {
          disposition = "Exceeded VirusTotal Limit for Submission";
          color = "warning";
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
          // Check if the submission_type is virustotal and modify data accordingly
          if (
            res.submitted_type &&
            res.submitted_type === "virustotal" &&
            res.strelka_response[0].file.flavors.mime[0] === "application/zip"
          ) {
            // Make sure that strelka_response is an array and has at least one element
            if (
              Array.isArray(res.strelka_response) &&
              res.strelka_response.length > 0
            ) {
              // Remove the first element of strelka_response
              res.strelka_response.shift();
            }
          }
          setData(res);
          setIsLoading(false);
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
      {/* Overlay - VirusTotal Drawer  */}
      <VirusTotalAugmentDrawer
        resource={selectedResource}
        open={virusTotalDrawerOpen}
        onClose={() => setVirusTotalDrawerOpen(false)}
      ></VirusTotalAugmentDrawer>

      {/* Overlay - File Details Drawer Overlay */}
      <Drawer
        title={
          selectedNodeData && (
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
                  <Text strong>
                    {selectedNodeData?.file?.name || "No Filename"}
                  </Text>
                  <div style={{ fontSize: "smaller", color: "#888" }}>
                    {(selectedNodeData.file.flavors?.yara &&
                      selectedNodeData.file.flavors.yara[0]) ||
                      selectedNodeData.file.flavors.mime[0]}
                  </div>
                </div>
              </div>
              <div>{getFileDisposition().tag}</div>
            </div>
          )
        }
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={1000}
      >
        <Col className="gutter-row" xs={32} sm={32} md={24} lg={24}>
          {/* Component Card - File Overview */}
          <FileOverviewLanding
            selectedNodeData={selectedNodeData}
            onOpenVT={handleVirusTotalClick}
            expandAll={expandAll}
            onToggleAllSections={toggleAllSections}
          />

          {/* Component Card - File Insights */}
          <FileInsightsLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File YARA */}
          <FileYaraLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File IOCs */}
          <FileIocsLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - Zip */}
          <ZipOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - SevenZip */}
          <SevenZipOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - Rar */}
            <RarOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - EncryptedZip */}
          <EncryptedZipOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File Header / Footer */}
          <FileHeaderFooterLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File TLSH */}
          <FileTlshLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File OCR Overview */}
          <OcrOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File QR Overview */}
          <QrOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File Email Overview */}
          <EmailOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File Visual Basic Overview */}
          <VbOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File XML Overview */}
          <XmlOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File JavaScript Overview */}
          <JavascriptOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File Exiftool Overview */}
          <ExiftoolOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File PE Overview */}
          <PeOverviewLanding
            selectedNodeData={selectedNodeData}
            expandAll={expandAll}
          />

          {/* Component Card - File JSON Overview */}
          <JsonViewLanding jsonData={selectedNodeData} expandAll={expandAll} />
        </Col>
      </Drawer>

      {/* Component Card - File Header Overview */}
      <FileHeaderLanding data={data} onOpenVT={handleVirusTotalClick} />

      {/* Main Components */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {/* Left Side Components */}
        <Col className="gutter-row" xs={6} sm={6} md={6} lg={6}>
          {/* Component Card - File Highlights */}
          <FileHighlightsOverviewLanding
            data={data}
            onFileNameSelect={handleFileNameSelect}
          />

          {/* Component Card - Potential IOCs */}
          <FileIocsOverviewLanding
            data={data}
            onFileIocSelect={handleFileIocSelect}
          />

          {/* Component Card - File Types */}
          <FileTypeOverviewLanding
            data={data}
            onFileTypeSelect={handleFileTypeSelect}
          />

          {/* Component Card - File YARAs */}
          <FileYaraOverviewLanding
            data={data}
            onFileYaraSelect={handleFileYaraSelect}
          />
        </Col>

        {/* ReactFlow / Visual Components */}
        <Col className="gutter-row" xs={24} sm={24} md={18} lg={18}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {/* Component Card - ReactFlow Tree */}
            <Collapse
              defaultActiveKey={[1]}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <Collapse.Panel header="Submission File Flow" key="1">
                <FileTreeCardWithProvider
                  data={data.strelka_response}
                  onNodeSelect={handleNodeSelect}
                  fileTypeFilter={fileTypeFilter}
                  fileYaraFilter={fileYaraFilter}
                  fileNameFilter={fileNameFilter}
                  fileIocFilter={fileIocFilter}
                  selectedNodeData={selectedNodeData}
                  setSelectedNodeData={setSelectedNodeData}
                />
              </Collapse.Panel>
            </Collapse>
            <JsonViewLanding jsonData={data} />
          </Row>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default SubmissionsPage;

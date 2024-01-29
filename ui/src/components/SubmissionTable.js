import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Table,
  Space,
  Tooltip,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  CopyOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { getIconConfig } from "../utils/iconMappingTable";

import { debounce } from "lodash";
import AuthCtx from "../contexts/auth";
import { fetchWithTimeout } from "../util.js";
import { APP_CONFIG } from "../config";

const { Text } = Typography;

/**
 * A table component for displaying submission data.
 */
const SubmissionTable = () => {
  const { handle401 } = useContext(AuthCtx);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [excludedSubmitters, setExcludedSubmitters] = useState(
    APP_CONFIG.DEFAULT_EXCLUDED_SUBMITTERS
  );
  const defaultSorter = { field: "submitted_at", order: "descend" };
  const [sorter, setSorter] = useState(defaultSorter);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Fetches Data from the Strelka UP API
  const fetchData = useCallback(async () => {
    // Sets Loading to True so table can reflect
    setIsLoading(true);

    // Build updated Search Query URL
    const searchUrl = `${
      APP_CONFIG.BACKEND_URL
    }/strelka/scans?search=${searchQuery}&page=${pagination.current}&per_page=${
      pagination.pageSize
    }&exclude_submitters=${excludedSubmitters.join(",")}&sortField=${
      sorter.field
    }&sortOrder=${sorter.order}`;

    // Fetch the Table Data from the Strelka UI API
    try {
      const res = await fetchWithTimeout(searchUrl, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        timeout: APP_CONFIG.API_TIMEOUT,
      });
      if (!res.ok) {
        throw new Error("Network response was not ok.");
      }
      const result = await res.json();
      setData(result.items);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error("Fetch table data failed:", error);
      message.error("Failed to fetch table data.");
      handle401();
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    excludedSubmitters,
    pagination.current,
    pagination.pageSize,
    sorter,
  ]);

  useEffect(() => {
    fetchData(); // Initial fetch
  }, [fetchData]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPagination({ ...pagination, current: 1 });
  };

  const handleExcludedSubmitterChange = (value) => {
    setExcludedSubmitters(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (newPagination, filters, newSorter) => {
    // If the newSorter object has a 'field' and 'order', it means a column was clicked for sorting.
    if (newSorter.field && newSorter.order) {
      setSorter({
        field: newSorter.field,
        order: newSorter.order,
      });
    } else {
      // Reset to default sorter if the sorter is cleared.
      setSorter(defaultSorter);
    }
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };
  <Input.Search
    placeholder="Search by File Name or Submission Description..."
    onChange={(e) => debouncedSearchChange(e)}
    style={{ fontSize: "12px" }}
  />;

  const debouncedSearchChange = useCallback(
    debounce((value) => handleSearchChange(value), 300),
    []
  );

  const columns = [
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UploadOutlined style={{ fontSize: 14 }} />
        </div>
      ),
      dataIndex: "submitted_type",
      key: "submitted_type",
      width: 1,
      render: (submitted_type, full) => {
        const typeToDisplay = submitted_type || "api";
        const imageSrc =
          typeToDisplay === "api" ? "/strelka.png" : "/virustotal.png";
        const tooltipText =
          typeToDisplay === "api"
            ? "Uploaded via File Upload"
            : "Uploaded via VirusTotal";

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title={tooltipText}>
              <img src={imageSrc} alt={typeToDisplay} width={24} height={24} />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Submitted
        </div>
      ),
      dataIndex: "submitted_at",
      key: "submitted_at",
      width: 1,
      sorter: true,
      defaultSortOrder: sorter.order,
      render: (submitted_at, submitted_type, full) => {
        return submitted_at ? (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {new Date(submitted_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </p>
        ) : (
          <p></p>
        );
      },
    },

    {
      title: "VT +",
      dataIndex: "strelka_response",
      key: "vt",
      width: 1,
      render: (strelkaResponse) => {
        // Find the highest VirusTotal enrichment number in the responses
        const highestVtEnrichment = strelkaResponse.reduce((max, response) => {
          const enrichmentNumber = response?.enrichment?.virustotal;
          return enrichmentNumber > max ? enrichmentNumber : max;
        }, -1); // Start with -1 to handle cases where there are no positive numbers

        const tagStyle = {
          fontSize: "10px",
          fontWeight: "bold",
          width: "80%",
          textAlignLast: "center",
          maxWidth: "75px",
        };

        let tagColor = "default";
        let vtText =
          highestVtEnrichment >= 0 ? highestVtEnrichment.toString() : "N/A";

        if (highestVtEnrichment >= 5) {
          tagColor = "error"; // red
        } else if (highestVtEnrichment >= 0) {
          tagColor = "success"; // green
        }

        return (
          <Tag color={tagColor} style={tagStyle}>
            {vtText}
          </Tag>
        );
      },
    },

    {
      title: "Filename",
      dataIndex: "file_id",
      key: "file_id",
      width: "25%",
      render: (file_id, full) => (
        <div
          style={{ maxWidth: "300px", display: "flex", alignItems: "center" }}
        >
          <Link
            to={`/submissions/${file_id}`}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {full.file_name}
          </Link>

          {/* Tooltip Icon */}
          <Tooltip title={full.submitted_description}>
            <InfoCircleOutlined style={{ marginLeft: "8px" }} />
          </Tooltip>
        </div>
      ),
    },

    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Uploader
        </div>
      ),
      dataIndex: "user.user_cn",
      key: "user.user_cn",
      width: 1,
      render: (_, full) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>{full.user?.user_cn}</p>
        </div>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Size
        </div>
      ),
      dataIndex: "file_size",
      key: "file_size",
      width: 1,
      sorter: true,
      render: (_, full) => {
        const fileSize = full.file_size;
        let size = 0;
        let unit = "B";

        if (fileSize >= 1024 * 1024) {
          size = (fileSize / (1024 * 1024)).toFixed(2);
          unit = "MB";
        } else if (fileSize >= 1024) {
          size = (fileSize / 1024).toFixed(2);
          unit = "KB";
        } else {
          size = fileSize;
        }

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>{`${size}${unit}`}</p>
          </div>
        );
      },
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Files
        </div>
      ),
      dataIndex: "file_count",
      key: "file_count",
      width: 1,
      sorter: true,
      render: (_, full) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>{full.files_seen}</p>
        </div>
      ),
    },

    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          IOCs
        </div>
      ),
      dataIndex: "iocs",
      key: "iocs",
      width: 1,
      sorter: true,
      render: (iocs) => {
        const tagStyle = {
          fontSize: "10px",
          fontWeight: "bold",
          width: "80%",
          textAlignLast: "center",
          maxWidth: "75px",
        };

        const iocsCount = iocs ? iocs.length : 0;
        const textColor =
          iocsCount > 2 ? "red" : iocsCount > 0 ? "orange" : "default";

        return (
          <div style={{ textAlign: "center" }}>
            <Tag color={textColor} style={tagStyle}>
              {iocsCount}
            </Tag>
          </div>
        );
      },
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Insights
        </div>
      ),
      dataIndex: "insights",
      key: "insights",
      width: 1,
      sorter: true,
      render: (insights) => {
        const insightCount = insights ? insights.length : 0;
        const textColor =
          insightCount > 5 ? "red" : insightCount > 3 ? "orange" : "default";
        const tagStyle = {
          fontSize: "10px",
          fontWeight: "bold",
          width: "80%",
          textAlignLast: "center",
          maxWidth: "75px",
        };

        return (
          <div style={{ textAlign: "center" }}>
            <Tag color={textColor} style={tagStyle}>
              {insightCount}
            </Tag>
          </div>
        );
      },
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Type
        </div>
      ),
      dataIndex: "mime_types",
      key: "mime_types",
      width: 1,
      sorter: true,
      render: (_, full) => {
        let mimeType = "N/A";

        // Clone the strelka_response to avoid directly mutating the state
        let strelkaResponse = [...full.strelka_response];

        // If the type is virustotal, remove the first item in strelka_response
        if (
          full.submitted_type === "virustotal" &&
          strelkaResponse.length > 0
        ) {
          strelkaResponse.shift();
        }

        // Proceed with the remaining logic for determining mimeType
        if (strelkaResponse.length > 0) {
          const response = strelkaResponse[0];
          mimeType =
            response.file.flavors?.yara?.[0] ||
            response.file.flavors?.mime?.[0] ||
            mimeType;
        }

        // Lookup Icon and Color entry based on mimeType
        const mappingEntry = getIconConfig("strelka", mimeType.toLowerCase());
        const bgColor = mappingEntry?.color || "defaultBackgroundColor";

        const tagStyle = {
          fontSize: "10px",
          fontWeight: "bold",
          width: "100%",
          textAlignLast: "center",
          maxWidth: "150px",
          paddingLeft: "5px",
          paddingRight: "5px",
          paddingTop: "0px",
          paddingBottom: "0px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        };

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tag style={tagStyle} color={bgColor}>
              {mimeType}
            </Tag>
          </div>
        );
      },
    },

    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          YARAs
        </div>
      ),
      dataIndex: "yara_hits",
      key: "yara_hits",
      width: 1,
      sorter: true,
      render: (yara_hits) => {
        const yarasCount = yara_hits ? yara_hits.length : 0;
        const textColor =
          yarasCount > 25 ? "orange" : yarasCount > 10 ? "yellow" : "default";
        const tagStyle = {
          fontSize: "10px",
          fontWeight: "bold",
          width: "80%",
          textAlignLast: "center",
          maxWidth: "75px",
        };
        return (
          <div style={{ textAlign: "center" }}>
            <Tag color={textColor} style={tagStyle}>
              {yarasCount}
            </Tag>
          </div>
        );
      },
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Scanners
        </div>
      ),
      key: "scanners_run",
      dataIndex: "scanners_run",
      width: 1,
      sorter: true,
      render: (scanners_run) => (
        <p style={{ textAlign: "center" }}>{scanners_run.length}</p>
      ),
    },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Actions
        </div>
      ),
      key: "action",
      width: 1,
      render: (text, record) => {
        // Find the sha256 hash in the array of hashes
        const sha256Array = record.hashes.find(
          (hashArray) => hashArray[0] === "sha256"
        );
        const sha256Value = sha256Array ? sha256Array[1] : "N/A";

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Space size="middle">
              {APP_CONFIG.SEARCH_URL && APP_CONFIG.SEARCH_NAME && (
                <Tooltip title={`Search ${APP_CONFIG.SEARCH_NAME}`}>
                  <a
                    target="_blank"
                    href={`${APP_CONFIG.SEARCH_URL}`.replace(
                      "<REPLACE>",
                      record.file_id
                    )}
                    rel="noreferrer"
                  >
                    <SearchOutlined style={{ cursor: "pointer" }} />
                  </a>
                </Tooltip>
              )}
              <Space size="middle">
                <Tooltip title="Copy SHA256">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      if (sha256Value !== "N/A") {
                        navigator.clipboard.writeText(sha256Value);
                        message.success("SHA256 copied to clipboard!");
                      } else {
                        message.error("SHA256 is undefined!");
                      }
                    }}
                  >
                    <CopyOutlined style={{ cursor: "pointer" }} />
                  </a>
                </Tooltip>
              </Space>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col span={18}>
          <Text type="secondary" style={{ fontSize: "12px", marginBottom: 8 }}>
            Search Filter
          </Text>
          <Input.Search
            placeholder="Search by File Name or Submission Description..."
            onChange={(e) => debouncedSearchChange(e)}
            style={{ fontSize: "12px" }}
          />
        </Col>
        <Col span={6}>
          <Text type="secondary" style={{ fontSize: "12px", marginBottom: 8 }}>
            Exclude Submitters
          </Text>
          <Select
            mode="tags"
            style={{ width: "100%", fontSize: "12px" }}
            placeholder="Submitters to exclude..."
            value={excludedSubmitters}
            onChange={handleExcludedSubmitterChange}
          />
        </Col>
      </Row>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default SubmissionTable;

import React, { useState, useEffect, useCallback } from "react";
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
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import { getIconConfig } from "../utils/iconMappingTable";

import { debounce } from "lodash";
import { fetchWithTimeout } from "../util.js";
import { APP_CONFIG } from "../config";

const { Text } = Typography;

/**
 * A table component for displaying submission data.
 */
const SubmissionTable = () => {
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
      title: "Submitted",
      dataIndex: "submitted_at",
      key: "submitted_at",
      width: 1,
      sorter: true,
      defaultSortOrder: sorter.order,
      render: (submitted_at, full) => {
        return submitted_at ? (
          <p>
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
      width: 1,
      render: (file_id, full) => (
        <div
          style={{ maxWidth: "200px", display: "flex", alignItems: "center" }}
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
      title: "Uploader",
      dataIndex: "user.user_cn",
      key: "user.user_cn",
      width: 1,
      render: (_, full) => <p>{full.user?.user_cn}</p>,
    },
    {
      title: "Size",
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

        return <p>{`${size}${unit}`}</p>;
      },
    },
    {
      title: "Files",
      dataIndex: "file_count",
      key: "file_count",
      width: 1,
      sorter: true,
      render: (_, full) => <p>{full.files_seen}</p>,
    },

    {
      title: "IOCs",
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
      title: "Insights",
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
      title: "Type",
      dataIndex: "mime_types",
      key: "mime_types",
      width: 1,
      sorter: true,
      render: (_, full) => {
        let mimeType = "N/A";

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

        if (full.strelka_response && full.strelka_response.length > 0) {
          const firstResponse = full.strelka_response[0];
          const secondResponse = full.strelka_response[1];
        
          // Check if the first record is a zip
          if (firstResponse.file.flavors?.mime?.[0] === "application/zip") {
            // Use the second record's MIME type if it exists and is not a zip
            if (secondResponse && secondResponse.file.flavors?.mime?.[0] !== "application/zip") {
              mimeType = secondResponse.file.flavors?.yara?.[0] || secondResponse.file.flavors?.mime?.[0] || mimeType;
            }
          } else {
            // Use the first record's MIME type
            mimeType = firstResponse.file.flavors?.yara?.[0] || firstResponse.file.flavors?.mime?.[0] || mimeType;
          }
        }

        const mappingEntry = getIconConfig("strelka", mimeType.toLowerCase());
        const bgColor = mappingEntry?.color || "defaultBackgroundColor";

        return (
          <Tag style={tagStyle} color={bgColor}>
            {mimeType}
          </Tag>
        );
      },
    },
    {
      title: "YARAs",
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
      title: "Scanners",
      key: "scanners_run",
      dataIndex: "scanners_run",
      width: 1,
      sorter: true,
      render: (scanners_run) => (
        <p style={{ textAlign: "center" }}>{scanners_run.length}</p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 1,
      render: (text, record) => {
        // Find the sha256 hash in the array of hashes
        const sha256Array = record.hashes.find(
          (hashArray) => hashArray[0] === "sha256"
        );
        const sha256Value = sha256Array ? sha256Array[1] : "N/A";

        return (
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

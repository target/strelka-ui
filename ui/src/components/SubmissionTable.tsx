import {
  CopyOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useVirusTotalApiKey } from '../hooks/useVirusTotalApiKey'
import { useMessageApi } from '../providers/MessageProvider'
import { getIconConfig } from '../utils/iconMappingTable'
import VirusTotalAugmentDrawer from './VirusTotal/VirusTotalAugmentDrawer'

import { debounce } from 'lodash'
import { APP_CONFIG } from '../config'
import { useSearchScans } from '../hooks/useSearchScans'
import { resubmitFile } from '../services/api'
const { Text } = Typography
/**
 * A table component for displaying submission data.
 */
const SubmissionTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [excludedSubmitters, setExcludedSubmitters] = useState(
    APP_CONFIG.DEFAULT_EXCLUDED_SUBMITTERS,
  )
  const defaultSorter = { field: 'submitted_at', order: 'descend' }
  const [sorter, setSorter] = useState(defaultSorter)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const [vtDrawerVisible, setVtDrawerVisible] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [resubmittingIds, setResubmittingIds] = useState<Set<string>>(new Set())
  const { isApiKeyAvailable } = useVirusTotalApiKey()
  const message = useMessageApi()

  // Function to handle opening the VT Augment
  const handleVtOpen = (sha256Hash) => {
    if (isApiKeyAvailable) {
      setSelectedResource(sha256Hash)
      setVtDrawerVisible(true)
    }
  }

  // Function to handle file resubmission
  const handleResubmit = async (submissionId: string, fileName: string) => {
    try {
      setResubmittingIds((prev) => new Set(prev).add(submissionId))

      const response = await resubmitFile(submissionId)

      message.success(
        `${fileName} resubmitted successfully! New submission ID: ${response.file_id}`,
      )

      // Refresh the table data by calling useSearchScans.reload
      reload()
    } catch (error) {
      console.error('Resubmit error:', error)
      message.error(
        `Failed to resubmit ${fileName}: ${error.response?.data?.details || error.message}`,
      )
    } finally {
      setResubmittingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(submissionId)
        return newSet
      })
    }
  }

  // Helper function to check if resubmit button should be shown
  const canResubmit = (record) => {
    return (
      record.s3_key &&
      record.s3_expires_at &&
      new Date(record.s3_expires_at) > new Date()
    )
  }

  // Fetches Data from the Strelka UP API
  const {
    data: result,
    isLoading,
    reload,
  } = useSearchScans({
    searchQuery,
    page: currentPage,
    pageSize: pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order,
    excludeSubmitters: excludedSubmitters,
  })

  useEffect(() => {
    if (result?.total > 0) {
      setTotal(result.total)
    }
  }, [result])

  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} items`,
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleExcludedSubmitterChange = (value) => {
    setExcludedSubmitters(value)
    setCurrentPage(1)
  }

  const handleTableChange = (newPagination, _filters, newSorter) => {
    // If the newSorter object has a 'field' and 'order', it means a column was clicked for sorting.
    if (newSorter.field && newSorter.order) {
      setSorter({
        field: newSorter.field,
        order: newSorter.order,
      })
    } else {
      // Reset to default sorter if the sorter is cleared.
      setSorter(defaultSorter)
    }
    setCurrentPage(newPagination.current)
    setPageSize(newPagination.pageSize)
  }

  const debouncedSearchChange = useCallback(
    debounce((value) => handleSearchChange(value), 300),
    [],
  )

  const columns = [
    {
      title: <UploadOutlined style={{ fontSize: '1rem' }} />,
      align: 'center' as const,
      dataIndex: 'submitted_type',
      key: 'submitted_type',
      width: 1,
      render: (submitted_type) => {
        const typeToDisplay = submitted_type || 'api'
        let imageSrc = '/strelka.png'
        let tooltipText = 'Uploaded via File Upload'
        if (typeToDisplay === 'virustotal') {
          imageSrc = '/virustotal.png'
          tooltipText = 'Uploaded via VirusTotal'
        } else if (typeToDisplay === 'resubmission') {
          imageSrc = '/strelka-resubmission.png'
          tooltipText = 'Uploaded via Resubmission'
        }

        return (
          <Tooltip title={tooltipText}>
            <img src={imageSrc} alt={typeToDisplay} width={24} height={24} />
          </Tooltip>
        )
      },
    },
    {
      title: 'Submitted',
      align: 'center' as const,
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      width: 1,
      sorter: true,
      defaultSortOrder: sorter.order as 'ascend' | 'descend',
      render: (submitted_at, _submitted_type, _full) => {
        return submitted_at ? (
          <p>
            {new Date(submitted_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        ) : (
          <p>&nbsp;</p>
        )
      },
    },
    {
      title: (
        <Tooltip title="Highest VT positives from all files shown">
          VT +
          <InfoCircleOutlined style={{ marginLeft: 4 }} />
        </Tooltip>
      ),
      align: 'center' as const,
      dataIndex: 'highest_vt_count',
      key: 'vt',
      width: 1,
      sorter: true,
      render: (highest_vt_count, record) => {
        const defaultTagStyle = {
          fontSize: '10px',
          fontWeight: 'bold',
          width: '80%',
          textAlign: 'center' as const,
          maxWidth: '75px',
        }

        const VtTagStyle = {
          fontSize: '10px',
          fontWeight: 'bold',
          width: '80%',
          textAlign: 'center' as const,
          maxWidth: '75px',
          cursor: 'pointer',
        }

        // Initialize the object to store the highest VT enrichment and SHA256
        const highestVt = {
          enrichment: highest_vt_count,
          sha256: record.highest_vt_sha256,
        }

        // Determine color based on enrichment value
        let vtColor = 'default'
        if (highestVt.enrichment > 5) {
          vtColor = 'volcano' // Ant Design's volcano color for high enrichment
        } else if (highestVt.enrichment >= 0) {
          vtColor = 'green' // Ant Design's green color for low enrichment
        }

        // Check if enrichment value is "N/A", then return a non-clickable tag without an icon
        if (highestVt.enrichment === -1) {
          return (
            <Tag color="default" style={defaultTagStyle}>
              N/A
            </Tag>
          )
        }

        // Enrichment value exists, so return a clickable tag with the VirusTotal icon
        return (
          <Tag
            color={vtColor}
            style={!isApiKeyAvailable ? defaultTagStyle : VtTagStyle}
            onClick={() =>
              !isApiKeyAvailable ? null : handleVtOpen(highestVt.sha256)
            }
          >
            {highestVt.enrichment}
          </Tag>
        )
      },
    },
    {
      title: 'Filename',
      dataIndex: 'file_id',
      key: 'file_id',
      sorter: true,
      width: '25%',
      render: (file_id, full) => (
        <div
          style={{ maxWidth: '300px', display: 'flex', alignItems: 'center' }}
        >
          <Link
            to={`/submissions/${file_id}`}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {full.file_name}
          </Link>

          {/* Tooltip Icon */}
          <Tooltip title={full.submitted_description}>
            <InfoCircleOutlined style={{ marginLeft: '8px' }} />
          </Tooltip>
        </div>
      ),
    },

    {
      title: 'Uploader',
      align: 'center' as const,
      dataIndex: 'user.user_cn',
      key: 'user.user_cn',
      width: 1,
      render: (_value, record) => record.user?.user_cn,
    },
    {
      title: 'Size',
      align: 'center' as const,
      dataIndex: 'file_size',
      key: 'file_size',
      width: 1,
      sorter: true,
      render: (value) => formatFileSize(value),
    },
    {
      title: 'Files',
      align: 'center' as const,
      dataIndex: 'files_seen',
      key: 'files_seen',
      width: 1,
      sorter: true,
    },
    {
      title: 'IOCs',
      align: 'center' as const,
      dataIndex: 'iocs',
      key: 'iocs',
      width: 1,
      sorter: true,
      render: (iocs) => {
        const tagStyle = {
          fontSize: '10px',
          fontWeight: 'bold',
          width: '80%',
          textAlign: 'center' as const,
          maxWidth: '75px',
        }

        const iocsCount = iocs ? iocs.length : 0
        const textColor =
          iocsCount > 2 ? 'red' : iocsCount > 0 ? 'orange' : 'default'

        return (
          <Tag color={textColor} style={tagStyle}>
            {iocsCount}
          </Tag>
        )
      },
    },
    {
      title: 'Insights',
      align: 'center' as const,
      dataIndex: 'insights',
      key: 'insights',
      width: 1,
      sorter: true,
      render: (insights) => {
        const insightCount = insights ? insights.length : 0
        const textColor =
          insightCount > 5 ? 'red' : insightCount > 3 ? 'orange' : 'default'
        const tagStyle = {
          fontSize: '10px',
          fontWeight: 'bold',
          width: '80%',
          textAlign: 'center' as const,
          maxWidth: '75px',
        }

        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={textColor} style={tagStyle}>
              {insightCount}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'Type',
      align: 'center' as const,
      dataIndex: 'mime_types',
      key: 'mime_types',
      width: 1,
      sorter: true,
      render: (value, _full) => {
        const mimeType = value[0] || 'N/A'
        // Clone the strelka_response to avoid directly mutating the state
        // const strelkaResponse = [...full.strelka_response]

        // // If the type is virustotal, remove the first item in strelka_response
        // if (
        //   full.submitted_type === 'virustotal' &&
        //   strelkaResponse[0].file.flavors.mime[0] === 'application/zip' &&
        //   strelkaResponse.length > 0
        // ) {
        //   strelkaResponse.shift()
        // }

        // // Proceed with the remaining logic for determining mimeType
        // if (strelkaResponse.length > 0) {
        //   const response = strelkaResponse[0]
        //   mimeType =
        //     response.file.flavors?.mime?.[0] ||
        //     response.file.flavors?.yara?.[0] ||
        //     mimeType
        // }
        // Lookup Icon and Color entry based on mimeType
        const mappingEntry = getIconConfig('strelka', mimeType.toLowerCase())
        const bgColor = mappingEntry?.color || 'defaultBackgroundColor'

        const tagStyle = {
          fontSize: '10px',
          fontWeight: 'bold',
          width: '100%',
          textAlign: 'center' as const,
          maxWidth: '150px',
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '0px',
          paddingBottom: '0px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Tag style={tagStyle} color={bgColor}>
              {mimeType}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'YARAs',
      align: 'center' as const,
      dataIndex: 'yara_hits',
      key: 'yara_hits',
      width: 1,
      sorter: true,
      render: (yara_hits) => {
        const yarasCount = yara_hits ? yara_hits.length : 0
        const textColor =
          yarasCount > 25 ? 'orange' : yarasCount > 10 ? 'yellow' : 'default'
        const tagStyle = {
          fontSize: '10px',
          fontWeight: 'bold',
          width: '80%',
          textAlign: 'center' as const,
          maxWidth: '75px',
        }
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag color={textColor} style={tagStyle}>
              {yarasCount}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'Scanners',
      align: 'center' as const,
      key: 'scanners_run',
      dataIndex: 'scanners_run',
      width: 1,
      sorter: true,
      render: (scanners_run) => scanners_run.length,
    },
    {
      title: 'Actions',
      align: 'center' as const,
      key: 'actions',
      width: 1,
      render: (_text, record) => {
        // Find the sha256 hash in the array of hashes
        const sha256Array = record.hashes.find(
          (hashArray) => hashArray[0] === 'sha256',
        )
        const sha256Value = sha256Array ? sha256Array[1] : 'N/A'

        const isResubmitting = resubmittingIds.has(record.file_id)
        const showResubmit = canResubmit(record)

        return (
          <Space size="small">
            {APP_CONFIG.SEARCH_URL && APP_CONFIG.SEARCH_NAME && (
              <Tooltip title={`Search ${APP_CONFIG.SEARCH_NAME}`}>
                <Button
                  type="link"
                  size="small"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    window.open(
                      `${APP_CONFIG.SEARCH_URL}`.replace(
                        '<REPLACE>',
                        record.file_id,
                      ),
                      '_blank',
                    )
                  }}
                />
              </Tooltip>
            )}

            <Tooltip title="Copy SHA256">
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  if (sha256Value !== 'N/A') {
                    navigator.clipboard.writeText(sha256Value)
                    message.success('SHA256 copied to clipboard!')
                  } else {
                    message.error('SHA256 is undefined!')
                  }
                }}
              />
            </Tooltip>
            {showResubmit && (
              <Tooltip title="Resubmit file for analysis">
                <Button
                  type="link"
                  size="small"
                  loading={isResubmitting}
                  disabled={isResubmitting}
                  onClick={() =>
                    handleResubmit(record.file_id, record.file_name)
                  }
                  icon={<ReloadOutlined />}
                />
              </Tooltip>
            )}
          </Space>
        )
      },
    },
  ]

  return (
    <div>
      <VirusTotalAugmentDrawer
        resource={selectedResource}
        onClose={() => setVtDrawerVisible(false)}
        open={vtDrawerVisible}
      />
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col span={18}>
          <Text type="secondary" style={{ fontSize: '12px', marginBottom: 8 }}>
            Search Filter
          </Text>
          <Input.Search
            placeholder="Search by File Name, Submission Description, Uploader, or YARA Matches..."
            onChange={(e) => debouncedSearchChange(e)}
            style={{ fontSize: '12px' }}
          />
        </Col>
        <Col span={6}>
          <Text type="secondary" style={{ fontSize: '12px', marginBottom: 8 }}>
            Exclude Submitters
          </Text>
          <Select
            mode="tags"
            style={{ width: '100%', fontSize: '12px' }}
            placeholder="Submitters to exclude..."
            value={excludedSubmitters}
            onChange={handleExcludedSubmitterChange}
          />
        </Col>
      </Row>
      <div
        style={{
          minHeight: '570px',
        }}
      >
        <Table
          size="small"
          loading={isLoading}
          columns={columns}
          dataSource={result?.items || []}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default SubmissionTable

function formatFileSize(fileSize) {
  let unit = 'B'
  let formattedSize: string
  if (fileSize >= 1024 * 1024) {
    formattedSize = (fileSize / (1024 * 1024)).toFixed(2)
    unit = 'MB'
  } else if (fileSize >= 1024) {
    formattedSize = (fileSize / 1024).toFixed(2)
    unit = 'KB'
  } else {
    formattedSize = fileSize
  }
  return `${formattedSize}${unit}`
}

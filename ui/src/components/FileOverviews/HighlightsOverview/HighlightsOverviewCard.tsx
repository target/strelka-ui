import {
  DownOutlined,
  InfoCircleOutlined,
  RightOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Tag, Tooltip, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { antdColors } from '../../../utils/colors'
import { getIconConfig } from '../../../utils/iconMappingTable'
import type { ScanData } from '../types'

const { Text } = Typography

interface HighlightsOverviewCardProps extends ScanData {
  onFileNameSelect: (fileName: string) => void
}

const HighlightsOverviewCard = (props: HighlightsOverviewCardProps) => {
  const { data, onFileNameSelect } = props
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [visibleNodeCount, setVisibleNodeCount] = useState(20) // start with 20 nodes visible
  const LOAD_MORE_COUNT = 10 // number of nodes to load on each click

  const insightsByNode = {}
  const iocsByNode = {}
  const mimeTypeByNode = {}
  const filenameByNode = {}

  // Function to load more nodes
  const loadMoreNodes = () => {
    setVisibleNodeCount((prevCount) => prevCount + LOAD_MORE_COUNT)
  }

  const getVTPositivesInfo = (response) => {
    const vtCount = response?.enrichment?.virustotal
    if (typeof vtCount === 'number') {
      if (vtCount < 0) {
        return null // No box if VT data is not available
      }
      return {
        count: vtCount,
        color: vtCount > 3 ? 'volcano' : 'green', // Red if > 3, green if 0-3
      }
    }
    return null // No box if VT data is not available
  }

  // Populate insights, iocs, mime types, and filenames by node
  for (const response of data.strelka_response) {
    if (response.insights?.length > 0 || response.iocs?.length > 0) {
      const nodeId = response.file.tree.node
      filenameByNode[nodeId] = response.file.name
      insightsByNode[nodeId] = (insightsByNode[nodeId] || []).concat(
        response.insights || [],
      )
      iocsByNode[nodeId] = (iocsByNode[nodeId] || []).concat(
        response.iocs?.map((ioc) => ioc.ioc) || [],
      )
      mimeTypeByNode[nodeId] = response.file.flavors.mime[0]
    }
  }

  // Sort nodes based on IOCs, insights, and filename
  const sortedNodeIds = Object.keys(filenameByNode)
    .map((nodeId) => ({
      nodeId,
      filename: filenameByNode[nodeId] || 'No Filename',
      iocCount: iocsByNode[nodeId]?.length || 0,
      insightCount: insightsByNode[nodeId]?.length || 0,
    }))
    .sort((a, b) => {
      // Get VT positives or assign a default for comparison
      const vtPositivesA =
        getVTPositivesInfo(
          data.strelka_response.find((res) => res.file.tree.node === a.nodeId),
        )?.count || 0
      const vtPositivesB =
        getVTPositivesInfo(
          data.strelka_response.find((res) => res.file.tree.node === b.nodeId),
        )?.count || 0

      // Descending sort for VT positives
      if (vtPositivesA !== vtPositivesB) {
        return vtPositivesB - vtPositivesA
      }

      if (a.iocCount !== b.iocCount) {
        return b.iocCount - a.iocCount
      }

      if (a.insightCount !== b.insightCount) {
        return b.insightCount - a.insightCount
      }

      return a.filename.localeCompare(b.filename)
    })
    .map((sortedItem) => sortedItem.nodeId)

  // Only show the nodes that are within the visibleNodeCount
  const visibleNodeIds = sortedNodeIds.slice(0, visibleNodeCount)

  // Check if there are any highlights
  const hasHighlights = sortedNodeIds.length > 0

  // useEffect hook to handle changes in selectedNodeId
  useEffect(() => {
    onFileNameSelect(selectedNodeId)
  }, [selectedNodeId, onFileNameSelect])

  const selectNode = (nodeId) => {
    const newSelectedNodeId = nodeId === selectedNodeId ? null : nodeId
    setSelectedNodeId(newSelectedNodeId)
    onFileNameSelect(nodeId)
  }

  const toggleNode = (nodeId) => {
    const newExpandedNodes = new Set(expandedNodes)
    if (newExpandedNodes.has(nodeId)) {
      newExpandedNodes.delete(nodeId)
    } else {
      newExpandedNodes.add(nodeId)
    }
    setExpandedNodes(newExpandedNodes)
  }

  const nodeList = visibleNodeIds.map((nodeId) => {
    const isExpanded = expandedNodes.has(nodeId)
    const filename = filenameByNode[nodeId] || 'No Filename'
    const insights = insightsByNode[nodeId] || []
    const iocs = iocsByNode[nodeId] || []
    const mimeType = mimeTypeByNode[nodeId]
    const iconConfig = getIconConfig('strelka', mimeType.toLowerCase())
    const IconComponent = iconConfig?.icon
    const bgColor = iconConfig?.color || antdColors.darkGray

    const response = data.strelka_response.find(
      (res) => res.file.tree.node === nodeId,
    )
    const vtPositivesInfo = getVTPositivesInfo(response)

    return (
      <div
        key={nodeId}
        onClick={() => selectNode(nodeId)}
        style={{
          marginBottom: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          background:
            selectedNodeId === nodeId ? `${antdColors.blue}10` : 'none',
          borderRadius: '5px',
          border:
            selectedNodeId === nodeId ? `1px solid ${antdColors.blue}` : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '60%' }}>
            <div
              style={{ paddingRight: '5px' }}
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(nodeId)
              }}
            >
              {isExpanded ? (
                <DownOutlined style={{ fontSize: '12px' }} />
              ) : (
                <RightOutlined style={{ fontSize: '12px' }} />
              )}
            </div>
            <div
              className="file-type-box"
              style={{ backgroundColor: bgColor, marginRight: '8px' }}
            >
              {IconComponent && (
                <IconComponent style={{ fontSize: '12px', color: 'white' }} />
              )}
            </div>
            <Tooltip title={filename}>
              <Text
                style={{
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {filename}
              </Text>
            </Tooltip>
          </div>
          <div>
            {vtPositivesInfo && (
              <Tooltip title="VirusTotal positives">
                <Tag
                  color={vtPositivesInfo.color}
                  style={{ margin: '1px', fontSize: '10px' }}
                >
                  {vtPositivesInfo.count}+
                </Tag>
              </Tooltip>
            )}
            {iocs.length > 0 && (
              <Tooltip title="Potential IOCs">
                <Tag color="purple" style={{ margin: '1px', fontSize: '10px' }}>
                  {iocs.length}
                </Tag>
              </Tooltip>
            )}
            {insights.length > 0 && (
              <Tooltip title="Insights">
                <Tag
                  color="geekblue"
                  style={{ margin: '1px', fontSize: '10px' }}
                >
                  {insights.length}
                </Tag>
              </Tooltip>
            )}
          </div>
        </div>
        {isExpanded && (
          <div style={{ paddingLeft: '20px' }}>
            {iocs.map((ioc) => (
              <Text
                key={`${nodeId}-ioc-${ioc}`}
                style={{
                  fontSize: '12px',
                  display: 'block',
                  color: antdColors.purple,
                }}
              >
                <div style={{ display: 'flex' }}>
                  <WarningOutlined
                    style={{
                      alignItems: 'start',
                      paddingTop: 2,
                      marginRight: 5,
                    }}
                  />
                  {ioc}
                </div>
              </Text>
            ))}
            {insights.map((insight) => {
              const isVirusTotal = insight.toLowerCase().includes('virustotal')
              const textColor = isVirusTotal
                ? antdColors.red
                : antdColors.geekblue
              return (
                <Text
                  key={`${nodeId}-insight-${insight}`}
                  style={{
                    fontSize: '12px',
                    display: 'block',
                    color: textColor,
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <InfoCircleOutlined
                      style={{
                        alignItems: 'start',
                        paddingTop: 2,
                        marginRight: 5,
                      }}
                    />
                    {insight}
                  </div>
                </Text>
              )
            })}
          </div>
        )}
      </div>
    )
  })

  return (
    <div>
      {hasHighlights ? (
        <>
          {nodeList}
          {visibleNodeCount < sortedNodeIds.length && (
            <Text
              onClick={loadMoreNodes}
              style={{
                cursor: 'pointer',
                fontWeight: '500',
                color: '#1890ff',
                marginLeft: '30px',
                fontSize: '12px',
              }}
            >
              ...and {sortedNodeIds.length - visibleNodeCount} more (show next{' '}
              {Math.min(
                LOAD_MORE_COUNT,
                sortedNodeIds.length - visibleNodeCount,
              )}
              )
            </Text>
          )}
        </>
      ) : (
        <Typography.Title
          level={5}
          style={{ color: antdColors.gray, textAlign: 'left', margin: '0px' }}
        >
          No Highlights for this Submission
        </Typography.Title>
      )}
    </div>
  )
}

export default HighlightsOverviewCard

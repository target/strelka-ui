import { ReloadOutlined } from '@ant-design/icons'
import { Button, Col, Row, Spin, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import PageWrapper from '../components/PageWrapper'

import FileIocsOverviewLanding from '../components/FileOverviews/FileIocsOverview/FileIocsOverviewLanding'
import FileTypeOverviewLanding from '../components/FileOverviews/FileTypeOverview/FileTypeOverviewLanding'
import HeaderLanding from '../components/FileOverviews/HeaderOverview/HeaderLanding'
import HighlightsOverviewLanding from '../components/FileOverviews/HighlightsOverview/HighlightsOverviewLanding'
import JsonViewLanding from '../components/FileOverviews/JsonView/JsonViewLanding'
import YaraOverviewLanding from '../components/FileOverviews/YaraOverview/YaraOverviewLanding'

import FileTreeCardWithProvider from '../components/FileFlow/FileTreeCardWithProvider'

import VirusTotalAugmentDrawer from '../components/VirusTotal/VirusTotalAugmentDrawer'

import { getIconConfig } from '../utils/iconMappingTable'

import '../styles/IconContainer.css'

import { useFetchScanById } from '../hooks/useFetchScanById'

import { NodeDetailsDrawer } from '../components/NodeDetailsDrawer'

import { CollapseCard } from '../components/CollapseCard'
import { useMessageApi } from '../providers/MessageProvider'
import { resubmitFile } from '../services/api'
import type { StrelkaResponse } from '../services/api.types'

/**
 * SubmissionsPage component to display strelka scan results
 * @returns JSX.Element
 */
const SubmissionsPage = () => {
  const { id } = useParams()
  const { data, isLoading } = useFetchScanById(id)
  const message = useMessageApi()
  const navigate = useNavigate()
  // TODO: handle 404

  const [selectedNodeData, setSelectedNodeData] =
    useState<StrelkaResponse>(null)
  const [fileTypeFilter, setFileTypeFilter] = useState(null)
  const [fileYaraFilter, setFileYaraFilter] = useState(null)
  const [fileNameFilter, setFileNameFilter] = useState(null)
  const [fileIocFilter, setFileIocFilter] = useState(null)
  const [virusTotalDrawerOpen, setVirusTotalDrawerOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [isResubmitting, setIsResubmitting] = useState(false)

  const [fileFlowExpanded, setFileFlowExpanded] = useState(true)
  const [jsonViewExpanded, setJsonViewExpanded] = useState(false)
  const [additionalActionsExpanded, setAdditionalActionsExpanded] =
    useState(true)

  const handleVirusTotalClick = (sha256Hash) => {
    setSelectedResource(sha256Hash) // Store the SHA hash for the VirusTotal drawer
    setVirusTotalDrawerOpen(true) // Open the drawer
  }

  // Function to handle file resubmission
  const handleResubmit = async () => {
    if (!data?.file_id) return

    try {
      setIsResubmitting(true)

      const response = await resubmitFile(data.file_id)

      message.success(
        `${data.file_name} resubmitted successfully! New submission ID: ${response.file_id}`,
      )

      // navigate to the new submission view
      navigate(`/submissions/${response.file_id}`)
    } catch (error) {
      console.error('Resubmit error:', error)
      message.error(
        `Failed to resubmit ${data.file_name}: ${error.response?.data?.details || error.message}`,
      )
    } finally {
      setIsResubmitting(false)
    }
  }

  // Helper function to check if resubmit button should be shown
  const canResubmit = () => {
    return (
      data?.s3_key &&
      data?.s3_expires_at &&
      new Date(data.s3_expires_at) > new Date()
    )
  }

  // Callback to set file type filter
  const handleFileTypeSelect = (fileType) => {
    setFileTypeFilter(fileType)
  }

  // Callback to set file name filter
  const handleFileNameSelect = (fileName) => {
    setFileNameFilter(fileName)
  }

  // Callback to set file yara filter
  const handleFileYaraSelect = (fileYara) => {
    setFileYaraFilter(fileYara)
  }

  // Callback to set file ioc filter
  const handleFileIocSelect = (fileIoc) => {
    setFileIocFilter(fileIoc)
  }

  // Callback for selected a node in the flow view
  const handleNodeSelect = (nodeData) => {
    setSelectedNodeData(nodeData)
    setDrawerVisible(true) // Open the drawer when a node is selected
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
    setSelectedNodeData(null) // Reset selected node data when drawer is closed
  }

  // Callback for monitoring filter changes. Need to deselect node.
  useEffect(() => {
    if (data?.strelka_response) {
      if (fileNameFilter) {
        // Find the node data based on the file name filter
        const nodeData = data.strelka_response.find(
          (response) => response.file.tree.node === fileNameFilter,
        )
        setSelectedNodeData(nodeData) // Set to found node data or reset if not found
      } else {
        // Reset selectedNodeData when other filters change
        setSelectedNodeData(null)
      }
    }
  }, [data, fileNameFilter])

  const getFileIcon = () => {
    let flavorKey: string
    if (
      selectedNodeData.file.flavors.yara &&
      selectedNodeData.file.flavors.yara.length > 0
    ) {
      // Use YARA flavor if available
      flavorKey = selectedNodeData.file.flavors.yara[0].toLowerCase()
    } else {
      // Use MIME flavor if YARA is not available
      flavorKey = selectedNodeData.file.flavors.mime[0].toLowerCase()
    }

    const mappingEntry = getIconConfig('strelka', flavorKey)
    const IconComponent = mappingEntry?.icon
    const bgColor = mappingEntry?.color || 'defaultBackgroundColor'

    // Return a JSX element with the container class
    return (
      <div className="file-overview-box" style={{ backgroundColor: bgColor }}>
        {IconComponent ? <IconComponent style={{ fontSize: '24px' }} /> : null}
      </div>
    )
  }

  const getFileDisposition = () => {
    const virustotalPositives = selectedNodeData.enrichment?.virustotal
    let disposition = ''
    let color = ''

    if (virustotalPositives || virustotalPositives === 0) {
      if (typeof virustotalPositives === 'number') {
        if (virustotalPositives === -1) {
          disposition = 'Not Found on VirusTotal'
          color = 'default'
        } else if (virustotalPositives === -3) {
          disposition = 'Exceeded VirusTotal Limit for Submission'
          color = 'warning'
        } else if (virustotalPositives === -2) {
          disposition = 'VirusTotal Not Enabled'
          color = 'default'
        } else if (virustotalPositives > 5) {
          disposition = 'Malicious'
          color = 'error'
        } else {
          disposition = 'Benign'
          color = 'success'
        }
      }
    } else {
      disposition = 'Not Found on VirusTotal'
      color = 'default'
    }
    return {
      tag: (
        <Tag color={color}>
          <b>{disposition}</b>
        </Tag>
      ),
      text: disposition,
    }
  }

  if (data) {
    // Check if the submission_type is virustotal and modify data accordingly
    if (
      data?.submitted_type === 'virustotal' &&
      data.strelka_response[0].file.flavors.mime[0] === 'application/zip'
    ) {
      // Make sure that strelka_response is an array and has at least one element
      if (
        Array.isArray(data.strelka_response) &&
        data.strelka_response.length > 0
      ) {
        // Remove the first element of strelka_response
        data.strelka_response.shift()
      }
    }
  }

  return isLoading ? (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Spin
        size="large"
        style={{
          display: 'flex',
          alignSelf: 'center',
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
      />

      {/* Overlay - File Details Drawer Overlay */}
      <NodeDetailsDrawer
        key={id}
        selectedNodeData={selectedNodeData}
        getFileIcon={getFileIcon}
        getFileDisposition={getFileDisposition}
        closeDrawer={closeDrawer}
        drawerVisible={drawerVisible}
        handleVirusTotalClick={handleVirusTotalClick}
      />

      {/* Component Card - File Header Overview */}
      <HeaderLanding data={data} onOpenVT={handleVirusTotalClick} />

      {/* Main Components */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {/* Left Side Components */}
        <Col className="gutter-row" xs={6} sm={6} md={6} lg={6}>
          {/* Component Card - File Highlights */}
          <HighlightsOverviewLanding
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
          <YaraOverviewLanding
            data={data}
            onFileYaraSelect={handleFileYaraSelect}
          />
          {canResubmit() && (
            <CollapseCard
              label="Additional Actions"
              expanded={additionalActionsExpanded}
              onExpandChange={(expanded) =>
                setAdditionalActionsExpanded(expanded)
              }
            >
              {/* Resubmit Button */}
              <Button
                type="link"
                loading={isResubmitting}
                disabled={isResubmitting}
                onClick={handleResubmit}
                icon={<ReloadOutlined />}
              >
                Resubmit File
              </Button>
            </CollapseCard>
          )}
        </Col>

        {/* ReactFlow / Visual Components */}
        <Col className="gutter-row" xs={24} sm={24} md={18} lg={18}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {/* Component Card - ReactFlow Tree */}
            <CollapseCard
              label="Submission File Flow"
              expanded={fileFlowExpanded}
              onExpandChange={(expanded) => setFileFlowExpanded(expanded)}
            >
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
            </CollapseCard>

            <JsonViewLanding
              selectedNodeData={data.strelka_response[0]}
              expanded={jsonViewExpanded}
              onExpandChange={(expanded) => setJsonViewExpanded(expanded)}
            />
          </Row>
        </Col>
      </Row>
    </PageWrapper>
  )
}

export default SubmissionsPage

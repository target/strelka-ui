import { useState } from 'react'
import EmailOverviewLanding from './FileOverviews/EmailOverview/EmailOverviewLanding'
import EncryptedZipOverviewLanding from './FileOverviews/EncryptedZipOverview/EncryptedZipOverviewLanding'
import ExiftoolOverviewLanding from './FileOverviews/ExiftoolOverview/ExiftoolOverviewLanding'
import FileInsightsLanding from './FileOverviews/FileInsights/FileInsightsLanding'
import FileOverviewLanding from './FileOverviews/FileOverview/FileOverviewLanding'
import FileYaraLanding from './FileOverviews/FileYara/FileYaraLanding'
import HeaderFooterLanding from './FileOverviews/HeaderFooterOverview/HeaderFooterLanding'
import JavascriptOverviewLanding from './FileOverviews/JavascriptOverview/JavascriptOverviewLanding'
import JsonViewLanding from './FileOverviews/JsonView/JsonViewLanding'
import OcrOverviewLanding from './FileOverviews/OcrOverview/OcrOverviewLanding'
import PeOverviewLanding from './FileOverviews/PeOverview/PeOverviewLanding'
import QrOverviewLanding from './FileOverviews/QrOverview/QrOverviewLanding'
import RarOverviewLanding from './FileOverviews/RarOverview/RarOverviewLanding'
import SevenZipOverviewLanding from './FileOverviews/SevenZipOverview/SevenZipOverviewLanding'
import SubmissionIocsLanding from './FileOverviews/SubmissionIocs/SubmissionIocsLanding'
import FileTlshLanding from './FileOverviews/TlshOverview/TlshLanding'
import VbOverviewLanding from './FileOverviews/VbOverview/VbOverviewLanding'
import XmlOverviewLanding from './FileOverviews/XmlOverview/XmlOverviewLanding'

import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Drawer, Flex, Typography } from 'antd'
import ZipOverviewLanding from './FileOverviews/ZipOverview/ZipOverviewLanding'
const { Text } = Typography

export const NodeDetailsDrawer = ({
  selectedNodeData,
  getFileIcon,
  getFileDisposition,
  closeDrawer,
  drawerVisible,
  handleVirusTotalClick,
}) => {
  const allSections = [
    {
      component: FileOverviewLanding,
      additionalProps: { onOpenVT: handleVirusTotalClick },
      startExpanded: true,
    },
    { component: FileInsightsLanding },
    { component: FileYaraLanding },
    { component: SubmissionIocsLanding },
    { component: ZipOverviewLanding },
    { component: SevenZipOverviewLanding },
    { component: RarOverviewLanding },
    { component: EncryptedZipOverviewLanding },
    { component: HeaderFooterLanding },
    { component: FileTlshLanding },
    { component: OcrOverviewLanding },
    { component: QrOverviewLanding },
    { component: EmailOverviewLanding },
    { component: VbOverviewLanding },
    { component: XmlOverviewLanding },
    { component: JavascriptOverviewLanding },
    { component: ExiftoolOverviewLanding },
    { component: PeOverviewLanding },
    { component: JsonViewLanding },
  ]

  const [expandedSections, setExpandedSections] = useState(
    allSections.map((section) => section.startExpanded || false),
  )

  const expandAll = () => {
    setExpandedSections(expandedSections.map(() => true))
  }

  const collapseAll = () => {
    setExpandedSections(expandedSections.map(() => false))
  }

  const doSetExpanded = (index, expanded) => {
    const newExpandesSections = [...expandedSections]
    newExpandesSections[index] = expanded
    setExpandedSections(newExpandesSections)
  }

  const doExpandChange = (index, expanded) => {
    doSetExpanded(index, expanded)
  }

  const sections = allSections.map((Section, index) => (
    <Section.component
      key={Section.component.name}
      {...Section.additionalProps}
      selectedNodeData={selectedNodeData}
      expanded={expandedSections[index]}
      onExpandChange={(expanded) => doExpandChange(index, expanded)}
    />
  ))

  return (
    <Drawer
      title={
        selectedNodeData && (
          <Flex justify="space-between" style={{ marginRight: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {getFileIcon()}
              <div style={{ marginLeft: '8px' }}>
                {' '}
                <Text strong>
                  {selectedNodeData?.file?.name || 'No Filename'}
                </Text>
                <div style={{ fontSize: 'smaller', color: '#888' }}>
                  {selectedNodeData.file.flavors?.yara?.[0] ||
                    selectedNodeData.file.flavors.mime[0]}
                </div>
              </div>
            </div>
            <Flex align="center">{getFileDisposition().tag}</Flex>
          </Flex>
        )
      }
      placement="right"
      onClose={closeDrawer}
      open={drawerVisible}
      width={1000}
    >
      <Col className="gutter-row" xs={32} sm={32} md={24} lg={24}>
        <Flex justify="flex-end" gap={10} style={{ marginBottom: '5px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={expandAll}
            style={{ fontSize: '0.75rem' }}
          >
            Expand All
          </Button>
          <Button
            type="primary"
            icon={<MinusOutlined />}
            size="small"
            onClick={collapseAll}
            style={{ fontSize: '0.75rem' }}
          >
            Collapse All
          </Button>
        </Flex>
        {sections}
      </Col>
    </Drawer>
  )
}

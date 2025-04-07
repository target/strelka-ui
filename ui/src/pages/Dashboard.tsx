import { useState } from 'react'

import {
  CalendarOutlined,
  LockOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Card, Col, Input, Row, Statistic, Typography } from 'antd'
import Dropzone from '../components/Dropzone'
import PageWrapper from '../components/PageWrapper'
import SubmissionTable from '../components/SubmissionTable'
import VirusTotalUploader from '../components/VirusTotal/VirusTotalUploader'
import MimeTypeBarChart from '../components/Visualizations/MimeTypeBarChart'
import { APP_CONFIG } from '../config'
import { useScanStats } from '../hooks/useScanStats'
import { useVirusTotalApiKey } from '../hooks/useVirusTotalApiKey'
import { useMessageApi } from '../providers/MessageProvider'

const { Title, Text } = Typography

const DashboardPage = () => {
  const message = useMessageApi()

  const [fileDescription, setFileDescription] = useState(
    'No Description Provided',
  )

  const [filePassword, setFilePassword] = useState('')

  const [filesUploaded, setFilesUploaded] = useState(0)

  const setDescription = (event) => {
    setFileDescription(event.target.value)
  }

  const setPassword = (event) => {
    setFilePassword(event.target.value)
  }

  const { isApiKeyAvailable } = useVirusTotalApiKey()
  const { data: stats, isLoading: loadingStats } = useScanStats()

  const queryClient = useQueryClient()

  const uploadProps = {
    name: 'file',
    multiple: true,
    data: { description: fileDescription, password: filePassword },
    withCredentials: true,
    action: `${APP_CONFIG.BACKEND_URL}/strelka/upload`,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        setFilesUploaded(filesUploaded + 1)
        // invalidate scans queries
        queryClient.invalidateQueries({
          queryKey: ['searchScans'],
        })
        queryClient.invalidateQueries({
          queryKey: ['scanStats'],
        })
        queryClient.invalidateQueries({
          queryKey: ['mimeTypeStats'],
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.response.details}`)
      }
    },
    showUploadList: {
      showRemoveIcon: false,
    },
  }

  const statsData = [
    {
      title: 'All Time Submissions',
      value: stats?.all_time,
      valueStyle: { color: '#3f8600' },
    },
    {
      title: 'Last 30 Days',
      value: stats?.thirty_days,
      valueStyle: { color: '#cf1322' },
    },
    {
      title: 'Last 7 Days',
      value: stats?.seven_days,
      valueStyle: { color: '#125ecf' },
    },
    {
      title: 'Last 24 Hours',
      value: stats?.twentyfour_hours,
      valueStyle: { color: '#cf8512' },
    },
  ]

  return (
    <PageWrapper title="Dashboard" subtitle="Overview of recent activities">
      <Row gutter={[16, 16]}>
        {statsData.map((statData) => (
          <Col xs={24} sm={12} md={6} key={statData.title}>
            <Card style={{ borderRadius: '20px' }}>
              <Statistic
                {...statData}
                loading={loadingStats}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <br />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" xs={8} sm={8} md={8} lg={8}>
          <Card>
            {!isApiKeyAvailable && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  textAlign: 'center',
                  color: 'grey',
                  fontSize: '18px',
                  padding: '20px',
                }}
              >
                <h3 style={{ margin: 0 }}>
                  Premium VirusTotal Key Not Provided
                </h3>
                <div>Please Review the README for Details</div>
              </div>
            )}
            <Typography>
              <Title style={{ marginTop: '0', paddingTop: '0' }} level={3}>
                Upload Via VirusTotal
              </Title>
              <Text type="secondary">
                Input a MD5, SHA1, or SHA256 hash to analyze a file from
                VirusTotal.
              </Text>
            </Typography>

            <br />

            <VirusTotalUploader
              onUploadSuccess={() => {
                setFilesUploaded(filesUploaded + 1)
                // invalidate scans queries so the table refreshes
                queryClient.invalidateQueries({
                  queryKey: ['searchScans'],
                })
                queryClient.invalidateQueries({
                  queryKey: ['scanStats'],
                })
                queryClient.invalidateQueries({
                  queryKey: ['mimeTypeStats'],
                })
              }}
            />
          </Card>

          <br />
          <Card>
            <Typography>
              <Title style={{ marginTop: '0', paddingTop: '0' }} level={3}>
                Upload File
              </Title>
              <div style={{ paddingBottom: 12 }}>
                <Text type="secondary">
                  Drop a file below to upload to Strelka.
                </Text>
              </div>
            </Typography>
            <div style={{ paddingBottom: 12 }}>
              <Input
                onChange={setDescription}
                placeholder="(Optional) Description to be saved with submission..."
                prefix={<MessageOutlined />}
              />
            </div>
            <div style={{ paddingBottom: 12 }}>
              <Input
                onChange={setPassword}
                placeholder="(Optional) Password to extract encrypted sample..."
                prefix={<LockOutlined />}
              />
            </div>
            <Dropzone {...uploadProps} />
          </Card>
        </Col>
        <Col className="gutter-row" xs={24} sm={24} md={16} lg={16}>
          <Card style={{ fontSize: '10px', height: '100%' }}>
            <Typography>
              <Title style={{ marginTop: '0', paddingTop: '0' }} level={3}>
                Submission Statistics
              </Title>
            </Typography>
            <MimeTypeBarChart height={582} />
          </Card>
        </Col>

        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
          <br />

          <Card>
            <Typography>
              <Title style={{ marginTop: '0', paddingTop: '0' }} level={3}>
                Analysis Submissions
              </Title>
            </Typography>
            <SubmissionTable key={filesUploaded} />{' '}
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  )
}

export default DashboardPage

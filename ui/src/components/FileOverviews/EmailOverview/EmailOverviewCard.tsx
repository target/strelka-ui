import { Col, List, Modal, Row, Tag, Typography } from 'antd'
import { useState } from 'react'
import '../../../styles/OcrOverviewCard.css'
import type { OverviewCardProps } from '../types'

const EmailOverviewCard = ({ data }: OverviewCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { Text } = Typography
  const base64Thumbnail = data.scan.email?.base64_thumbnail

  const showModal = () => setIsModalVisible(true)
  const handleCancel = () => setIsModalVisible(false)

  // Placeholder for Thumbnail in case it's disabled or not functioning
  const ThumbnailPlaceholder = () => {
    return <div className="thumbnail-placeholder" />
  }

  const {
    attachments: { filenames = [] } = {},
    from,
    to,
    date_utc,
    message_id,
    subject,
    received_domain = [],
    body,
  } = data.scan.email || {}

  // Check if the subject contains [External] (case insensitive)
  const isExternalSender = subject?.toLowerCase().includes('[external]')

  // Create the list data conditionally
  const listData = [
    // Conditionally add "External Sender" row if it's an external sender
    isExternalSender
      ? {
          title: 'External Sender',
          tag: 'Insight',
        }
      : null,
    {
      title: 'Subject',
      description: subject || 'No Subject',
      tag: 'Informational',
    },
    { title: 'Sender', description: from || 'No Sender', tag: 'Informational' },
    {
      title: 'Recipients',
      description: to?.map((name) => ({ name })) || 'No Recipients',
      tag: 'Informational',
    },
    {
      title: 'Received',
      description: date_utc || 'No Date',
      tag: 'Informational',
    },
    {
      title: 'Message ID',
      description: message_id || 'No Message ID',
      tag: 'Informational',
    },
    // Check if filenames exist and is an array before trying to map over it
    ...(Array.isArray(filenames) && filenames.length > 0
      ? [
          {
            title: 'Attachment Names',
            description: filenames.map((name) => ({ name })) || [],
            tag: 'Informational',
          },
        ]
      : []),
    {
      title: 'Domains in Header',
      description:
        received_domain.map((domain) => ({ domain })) || 'No Domains',
      tag: 'Informational',
    },
    { title: 'Body', description: body || 'No Body', tag: 'Informational' },
  ].filter((item) => item !== null)

  return (
    <div className="ocr-overview" style={{ maxHeight: '600px' }}>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <List
              itemLayout="horizontal"
              dataSource={listData}
              bordered
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div>
                        <Text strong style={{ fontSize: 12 }}>
                          {item?.title}
                        </Text>
                        {item?.tag && (
                          <Tag
                            color={
                              item.tag === 'Informational'
                                ? 'default'
                                : 'warning'
                            }
                            style={{
                              marginLeft: 8,
                              fontSize: 10,
                            }}
                          >
                            {item.tag}
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      item?.description &&
                      (Array.isArray(item.description) ? (
                        <ul style={{ paddingLeft: 16 }}>
                          {item.description.map((subItem) => (
                            <li key={subItem.name || subItem.domain}>
                              <Text style={{ fontSize: 12 }} copyable>
                                {subItem.name || subItem.domain}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Text style={{ fontSize: 12 }} copyable>
                          {item.description}
                        </Text>
                      ))
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col span={9} className="thumbnail-container">
          {base64Thumbnail ? (
            <>
              <img
                src={`data:image/jpeg;base64,${base64Thumbnail}`}
                alt="Email Preview"
                style={{
                  width: 'auto',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  cursor: 'pointer',
                }}
                onClick={showModal}
              />
              <Modal
                open={isModalVisible}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  src={`data:image/jpeg;base64,${base64Thumbnail}`}
                  alt="Email Preview (Expanded)"
                  style={{ width: '100%' }}
                />
              </Modal>
            </>
          ) : (
            <ThumbnailPlaceholder />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default EmailOverviewCard

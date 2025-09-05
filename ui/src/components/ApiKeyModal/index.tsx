import { CopyOutlined } from '@ant-design/icons'
import { Modal, Spin, Tag, Typography } from 'antd'
import { useApiKey } from '../../hooks/useApiKey'
import { useMessageApi } from '../../providers/MessageProvider'

const { Paragraph } = Typography

interface ApiKeyModalProps {
  open: boolean
  onCancel: () => void
}

const copyToClipboard = async (text, message) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success('API key copied to clipboard!')
  } catch (err) {
    console.error(err)
    message.error('Failed to copy API key to clipboard.')
  }
}

export const ApiKeyModal = ({ open, onCancel }: ApiKeyModalProps) => {
  const { apiKey, isLoading } = useApiKey()

  const message = useMessageApi()

  return (
    <Modal
      title="API Key"
      width={800}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <center>
        <Tag
          style={{ cursor: 'pointer', fontSize: '16px' }}
          icon={<CopyOutlined />}
          color="success"
          onClick={() => copyToClipboard(apiKey, message)}
        >
          {isLoading ? <Spin /> : apiKey}
        </Tag>
      </center>
      <br />
      <Paragraph style={{ textAlign: 'center' }}>
        <a href="/api/docs" target="_blank" rel="noopener noreferrer">
          OpenAPI Docs
        </a>
        &nbsp;|&nbsp;
        <a href="/api/swagger.json" target="_blank" rel="noopener noreferrer">
          Swagger JSON
        </a>
      </Paragraph>
    </Modal>
  )
}

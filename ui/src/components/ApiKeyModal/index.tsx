import { CopyOutlined } from '@ant-design/icons'
import { Modal, Spin, Tag, Typography } from 'antd'
import { useApiKey } from '../../hooks/useApiKey'
import { useMessageApi } from '../../providers/MessageProvider'
import { examples } from './examples'

const { Paragraph, Text } = Typography

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
      <Paragraph>
        Examples of using your API key with Python requests:
      </Paragraph>
      <Text>{examples}</Text>
    </Modal>
  )
}

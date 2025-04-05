import { MessageOutlined, NumberOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useCallback, useState } from 'react'
import { APP_CONFIG } from '../../config'
import { useMessageApi } from '../../providers/MessageProvider'
import { fetchWithTimeout } from '../../util'

interface VirusTotalUploaderProps {
  onUploadSuccess: () => void
}

const VirusTotalUploader = (props: VirusTotalUploaderProps) => {
  const { onUploadSuccess } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const message = useMessageApi()

  const handleSubmitVtHash = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true)
        const payload = {
          description: values.description,
          hash: values.hash,
        }

        // TODO: move this to a service
        fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'cors',
          credentials: 'include',
          timeout: APP_CONFIG.API_TIMEOUT,
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(
                  errorData.details || 'Error occurred while submitting hash',
                )
              })
            }
            return response.json()
          })
          .then(() => {
            onUploadSuccess() // Trigger table refresh
            form.resetFields() // Reset fields
            message.success(
              `${values.hash} analyzed successfully via VirusTotal!`,
            )
            setLoading(false) // Stop loading
          })
          .catch((error) => {
            message.error(`Error submitting hash: ${error.message}`)
            setLoading(false) // Stop loading
          })
      })
      .catch((_errorInfo) => {
        // Handle form validation error
        message.error(
          'Error submitting hash: Hash must be a valid MD5 (32), SHA1 (40), or SHA256 (64) characters long',
        )
      })
  }, [form, message, onUploadSuccess])

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="description"
        initialValue=""
        style={{ marginBottom: '12px' }}
      >
        <Input
          prefix={<MessageOutlined />}
          placeholder="(Optional) Description to be saved with submission..."
        />
      </Form.Item>
      <Form.Item
        name="hash"
        rules={[
          { required: true, message: 'Please input a hash' },
          () => ({
            validator(_, value) {
              if (!value || [32, 40, 64].includes(value.length)) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error(
                  'Hash must be a valid MD5 (32), SHA1 (40), or SHA256 (64) characters long',
                ),
              )
            },
          }),
        ]}
        style={{ marginBottom: '12px' }}
      >
        <Input
          prefix={<NumberOutlined />}
          placeholder="MD5, SHA1, SHA256 Hash..."
          disabled={loading}
          style={{ fontSize: '12px' }}
        />
      </Form.Item>
      <Form.Item style={{ float: 'right', marginBottom: '0px' }}>
        <Button type="primary" onClick={handleSubmitVtHash} loading={loading}>
          Submit Hash
        </Button>
      </Form.Item>
    </Form>
  )
}

export default VirusTotalUploader

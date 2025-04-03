import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import type { UploadProps } from 'antd/lib/upload/interface'

const { Dragger } = Upload

const Dropzone = (props: UploadProps) => {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint" style={{ margin: '0px' }}>
        Support for a single or bulk upload.
      </p>
      <p className="ant-upload-hint" style={{ margin: '0px' }}>
        File size limited to 150MB.
      </p>
      <p
        className="ant-upload-hint"
        style={{ fontSize: '10px', marginTop: '8px', marginBottom: '0px' }}
      >
        Password encrypted samples support ZIP, RAR, and 7z.
      </p>
    </Dragger>
  )
}

export default Dropzone

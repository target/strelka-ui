import { Button, Checkbox, Col, Input, Modal, Row, Tooltip } from 'antd'
import { useState } from 'react'
import '../../../styles/OcrOverviewCard.css'

const OcrOverviewCard = ({ data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [wrapText, setWrapText] = useState(false)
  const [trimText, setTrimText] = useState(true)
  const [filter, setFilter] = useState('')
  const [isBlurred, setIsBlurred] = useState(!!data.scan.qr) // State to manage blur for QR codes

  const showModal = () => {
    // Only show modal if the image is not blurred
    if (!isBlurred) {
      setIsModalVisible(true)
    }
  }
  const handleCancel = () => setIsModalVisible(false)
  const toggleBlur = () => setIsBlurred(!isBlurred)

  let texts = []
  // Use text array or convert single text to array
  if (Array.isArray(data.scan.ocr?.text)) {
    texts = data.scan.ocr.text
  } else {
    texts = [data.scan.ocr?.text || '']
  }

  const base64Thumbnail = data.scan.ocr?.base64_thumbnail

  // Function to trim trailing whitespace or empty lines from a single line of text
  const trimLine = (line) => (trimText ? line.replace(/\s+$/, '') : line)

  // Function to trim all text content if it's not already an array
  texts = texts.map(trimLine)

  // Placeholder for Thumbnail in case its disabled / not functioning
  const ThumbnailPlaceholder = () => {
    return <div className="thumbnail-placeholder" />
  }

  // Conditional styling for blurred image (QR codes)
  const imageStyle = isBlurred
    ? {
        filter: 'blur(4px)',
        cursor: 'pointer',
      }
    : {
        cursor: 'pointer',
      }

  // Function to create line numbers and corresponding text
  const renderTextLines = (texts) => {
    let lineNumber = 1 // Initialize line number
    const lowerCaseFilter = filter.toLowerCase() // Convert filter to lower case
    return texts.flatMap((textContent) => {
      // Split each text block by new lines and filter based on the user's input
      const lines = textContent
        .split(/\r?\n/)
        .filter(
          (line) => !filter || line.toLowerCase().includes(lowerCaseFilter),
        ) // Convert line to lower case
      // Map over each line and return a table row while incrementing the line number
      return lines.map((line) => (
        <tr key={lineNumber}>
          <td className="line-number">{lineNumber++}</td>
          <td className={`line-content ${wrapText ? 'wrap' : 'no-wrap'}`}>
            {line}
          </td>
        </tr>
      ))
    })
  }

  return (
    <div className="ocr-overview">
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Input
            placeholder="Filter"
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={8}>
          <Tooltip title="Toggle text wrapping">
            <Checkbox
              checked={wrapText}
              onChange={(e) => setWrapText(e.target.checked)}
            >
              Wrap
            </Checkbox>
          </Tooltip>
          <Tooltip title="Toggle trimming of trailing spaces">
            <Checkbox
              checked={trimText}
              onChange={(e) => setTrimText(e.target.checked)}
            >
              Trim
            </Checkbox>
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col
          span={16}
          className="text-container"
          style={{ overflowX: wrapText ? 'hidden' : 'scroll' }}
        >
          <table>
            <tbody>{renderTextLines(texts)}</tbody>
          </table>
        </Col>
        <Col span={7} className="thumbnail-container">
          {base64Thumbnail ? (
            <div className="thumbnail-wrapper">
              <img
                src={`data:image/jpeg;base64,${base64Thumbnail}`}
                alt="Email Preview"
                style={imageStyle}
                onClick={showModal}
              />
              {isBlurred && (
                <div>
                  <Tooltip title="QR codes can pose a security risk, use with caution">
                    <Button
                      onClick={toggleBlur}
                      danger
                      className="centered-button"
                    >
                      Remove Blur
                    </Button>
                  </Tooltip>
                </div>
              )}
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
            </div>
          ) : (
            <ThumbnailPlaceholder />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default OcrOverviewCard

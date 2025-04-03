import { InfoCircleOutlined } from '@ant-design/icons'
import { Col, Row, Tag, Tooltip, Typography } from 'antd'
import styled from 'styled-components'
import { useVirusTotalApiKey } from '../../../hooks/useVirusTotalApiKey'
import type { OverviewCardProps } from '../types'

const { Text } = Typography

const VirusTotalInfoContent = styled(({ isclickable, ...props }) => (
  <div {...props} />
))`
  display: flex;
  align-items: center;
  cursor: ${({ isclickable }) => (isclickable ? 'pointer' : 'default')};
`

const VirusTotalTag = styled(Tag)`
  fontSize: "10px",
  fontWeight: "bold",
  width: "80%",
  textAlignLast: "center",
  maxWidth: "75px",
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  font-size: small;
  color: #888;
`

const getVirusTotalTagProps = (positives) => {
  let vtColor = 'default' // Default for not available or not applicable cases
  if (positives > 5) {
    vtColor = 'red' // Color "volcano" from Ant Design for a red tone
  } else if (positives === 0) {
    vtColor = 'success' // Green color for benign
  }

  return vtColor
}

interface FileOverviewCardProps extends OverviewCardProps {
  onOpenVT: (hash: string) => void
}

/**
 * Component that displays an overview of a file's properties.
 *
 * @param {Object} props - Component properties.
 * @param {Object} onOpenVt - Resource for VT Augment
 * @param {Object} props.data - The data object containing file and scan information.
 * @returns {JSX.Element} A JSX element representing the card.
 */
const FileOverviewCard = ({ data, onOpenVT }: FileOverviewCardProps) => {
  const virustotalData = data?.enrichment?.virustotal
  const vtColor = getVirusTotalTagProps(virustotalData)
  const { isApiKeyAvailable } = useVirusTotalApiKey()

  // Helper function to format the text row for display.
  const renderTextRow = (label, content, isCode = false, copyable = false) => (
    <Row>
      <Col span={3}>
        <Text style={{ fontSize: '12px' }}>{label}</Text>
      </Col>
      <Col span={18}>
        <Text code={isCode} copyable={copyable} style={{ fontSize: '12px' }}>
          {content || 'No Filename'}
        </Text>
      </Col>
    </Row>
  )

  // Helper function to open VT Augment if exists
  const handleVirusTotalClick = () => {
    if (isApiKeyAvailable) {
      onOpenVT(data.scan.hash.sha256)
    }
  }

  // Function to handle entropy styling
  const getEntropyStyle = (entropy) => {
    let colorObj = { color: '#8D6E63', fontWeight: '500' }
    if (entropy > 6.5) {
      colorObj = { color: '#ff4d4f', fontWeight: '700' }
    } else if (entropy < 3.5) {
      colorObj = { color: '#4CAF50', fontWeight: '500' }
    }
    return colorObj
  }

  // Function to handle entropy styling and tooltip
  const renderEntropy = (entropyValue) => {
    const entropyStyle = getEntropyStyle(entropyValue)
    const entropyTooltip = (
      <span>
        Entropy is a measure of randomness. High entropy (&gt; 6.5) may indicate
        the file is packed, compressed, or encrypted, which could be a sign of
        an attempt to avoid detection.
      </span>
    )

    return (
      <Row>
        <Col span={3}>
          <Text style={{ fontSize: '12px' }}>Entropy:</Text>
        </Col>
        <Col span={18}>
          <Text style={{ fontSize: '12px', ...entropyStyle }}>
            {entropyValue.toFixed(3)}
            <Tooltip title={entropyTooltip}>
              <InfoCircleOutlined style={{ marginLeft: 5 }} />
            </Tooltip>
          </Text>
        </Col>
      </Row>
    )
  }

  return (
    <div style={{ padding: '10px' }}>
      {renderTextRow('File Name:', data.file.name)}
      {renderTextRow('MIME Type:', data.file.flavors.mime?.join(', '), true)}
      {renderTextRow(
        'YARA Flavors:',
        data.file.flavors.yara?.join(', ') || 'N/A',
        true,
      )}
      {renderTextRow('MD5:', data.scan.hash.md5, true, true)}
      {renderTextRow('SHA1:', data.scan.hash.sha1, true, true)}
      {renderTextRow('SHA256:', data.scan.hash.sha256, true, true)}
      {renderTextRow('SSDeep:', data.scan.hash.ssdeep, true, true)}
      {renderTextRow('TLSH:', data.scan.hash.tlsh, true, true)}
      {renderTextRow(
        'Size:',
        `${(data.file.size / 1024).toFixed(2)} KB (${data.file.size} bytes)`,
      )}
      {data.scan?.entropy && renderEntropy(data.scan.entropy.entropy)}
      <Row>
        <Col span={3}>
          <Text style={{ fontSize: '12px' }}>VirusTotal:</Text>
        </Col>
        <Col span={18}>
          <Text style={{ fontSize: '12px' }}>
            {typeof virustotalData !== 'undefined' && virustotalData > -1 && (
              <InfoRow onClick={handleVirusTotalClick}>
                <VirusTotalInfoContent isclickable={isApiKeyAvailable}>
                  <img
                    src="/virustotal.png"
                    alt="VirusTotal"
                    width={12}
                    height={12}
                  />
                  <VirusTotalTag
                    style={{ fontSize: '10px', marginLeft: 6 }}
                    color={vtColor}
                  >
                    {virustotalData} Positives
                  </VirusTotalTag>
                </VirusTotalInfoContent>
              </InfoRow>
            )}
            {(typeof virustotalData === 'undefined' || virustotalData < 0) && (
              <InfoRow onClick={handleVirusTotalClick}>
                <VirusTotalInfoContent isclickable={isApiKeyAvailable}>
                  <img
                    src="/virustotal.png"
                    alt="VirusTotal"
                    width={12}
                    height={12}
                  />
                  <VirusTotalTag
                    style={{ fontSize: '10px', marginLeft: 6 }}
                    color="default"
                  >
                    N/A
                  </VirusTotalTag>
                </VirusTotalInfoContent>
              </InfoRow>
            )}
          </Text>
        </Col>
      </Row>
    </div>
  )
}

export default FileOverviewCard

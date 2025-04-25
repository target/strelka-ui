import { Button, Card, Row, Tag, Tooltip, Typography } from 'antd'
import { useCallback } from 'react'
import { getIconConfig } from '../../../utils/iconMappingTable'

import styled from 'styled-components'
import { APP_CONFIG } from '../../../config'
import { useVirusTotalApiKey } from '../../../hooks/useVirusTotalApiKey'
import type { Scan } from '../../../services/api.types'
import { getColorForString } from '../../../utils/colors'
import type { ScanData } from '../types'

const { Text } = Typography

const StyledTag = styled(Tag)`
  margin-bottom: 4px;
  font-size: 12px;
`

const StyledText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  margin-right: 8px;
`

const VirusTotalTag = styled(Tag)`
  fontSize: "10px",
  fontWeight: "bold",
  width: "80%",
  textAlignLast: "center",
  maxWidth: "75px",
`

const LeftWrapper = styled.div<{ $bgColor?: string }>`
  margin-right: 15px;
  width: 44px;
  height: 44px;
  background-color: ${({ $bgColor }) => $bgColor || '#91caff'};
  border-radius: 6px;
  flex: 0 0 44px;
  display: flex;
  justify-content: center;
  align-items: right;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  p {
    color: #ffffff;
    text-transform: uppercase;
    font-size: min(max(12px, 4vw), 14px);
    letter-spacing: 1px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  font-size: small;
  color: #888;
`

const InfoLabel = styled.div`
  min-width: 80px; // Set a minimum width for labels
`

const InfoContent = styled.div`
  flex: 1;
`

// Function to format the file size
const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

const getVirusTotalTagProps = (positives) => {
  if (positives > 5) {
    return 'red' // Color "volcano" from Ant Design for a red tone
  }

  if (positives === 0) {
    return 'success' // Green color for benign
  }

  return 'default' // Default for not available or not applicable cases
}

const getDisposition = (data: Scan) => {
  let text = 'Not Found on VirusTotal' // Default text
  let color = 'default' // Default color

  for (const response of data.strelka_response) {
    if (response.enrichment && response.enrichment.virustotal !== undefined) {
      const virustotal = response.enrichment.virustotal
      if (typeof virustotal === 'number' && virustotal > 5) {
        text = 'Malicious'
        color = 'red'
        break
      }

      if (
        data.strelka_response[0]?.enrichment?.virustotal === 0 &&
        text !== 'Malicious'
      ) {
        text = 'Benign'
        color = 'success'
      }
    }
  }

  return (
    <Tag style={{ fontSize: '11px' }} color={color}>
      {text}
    </Tag>
  )
}

interface HeaderOverviewCardProps extends ScanData {
  onOpenVT: (sha256Hash: string) => void
}

const HeaderOverviewCard = (props: HeaderOverviewCardProps) => {
  const { data, onOpenVT } = props
  const sortedScannersRun = [...(data?.scanners_run || [])].sort()
  const virustotalData = data.strelka_response[0]?.enrichment?.virustotal
  const vtColor = getVirusTotalTagProps(virustotalData)
  const { isApiKeyAvailable } = useVirusTotalApiKey()
  const getColorForMimetypes = useCallback(
    (str: string | string[]) => getColorForString(str),
    [],
  )

  const mappingEntry = getIconConfig(
    'strelka',
    data.strelka_response[0].file.flavors.mime[0].toLowerCase(),
  )
  const IconComponent = mappingEntry?.icon
  const color = mappingEntry?.color || 'default'

  const handleVirusTotalClick = () => {
    if (isApiKeyAvailable) {
      const sha256Hash = data.strelka_response[0]?.scan?.hash?.sha256
      onOpenVT(sha256Hash)
    }
  }

  return (
    <div style={{ marginBottom: '10px', paddingBottom: '5px' }}>
      <Card
        type="inner"
        title={
          <div style={{ padding: '5px' }}>
            <Row style={{ alignItems: 'center' }}>
              <div style={{ flex: 1 }}>{data.file_name}</div>
              <div>
                {data?.iocs && data?.iocs?.length > 0 && (
                  <Tag
                    style={{
                      margin: '2px',
                      fontWeight: '500',
                      fontSize: '11px',
                    }}
                    color="purple"
                  >
                    Potential IOCs: {data.iocs.length}
                  </Tag>
                )}
                {data?.insights && data?.insights?.length > 0 && (
                  <Tag
                    style={{
                      margin: '2px',
                      fontWeight: '500',
                      fontSize: '11px',
                    }}
                    color="blue"
                  >
                    Insights: {data.insights.length}
                  </Tag>
                )}
                <span style={{ padding: '5px' }}>{getDisposition(data)}</span>
                {[
                  APP_CONFIG.SEARCH_URL && APP_CONFIG.SEARCH_NAME && (
                    <a
                      href={`${APP_CONFIG.SEARCH_URL.replace(
                        '<REPLACE>',
                        data.file_id,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="small" style={{ fontSize: '12px' }}>
                        View in {APP_CONFIG.SEARCH_NAME}
                      </Button>
                    </a>
                  ),
                ]}
              </div>
            </Row>
            <Row>
              {/* Display unique mimetypes from all responses */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {Array.from(
                  new Set(
                    data?.strelka_response?.flatMap(
                      (response) => response?.file?.flavors?.mime,
                    ),
                  ),
                )
                  .slice(0, 4)
                  .map((type, index) => (
                    <Tooltip
                      title={data?.strelka_response[index]?.file?.name}
                      key={type}
                    >
                      <Tag
                        style={{
                          margin: '2px',
                          fontWeight: '500',
                          fontSize: '11px',
                        }}
                        color={getColorForMimetypes(type)}
                      >
                        {type}
                      </Tag>
                    </Tooltip>
                  ))}
                {Array.from(
                  new Set(
                    data?.strelka_response?.flatMap(
                      (response) => response?.file?.flavors?.mime,
                    ),
                  ),
                ).slice(4).length > 0 && (
                  <Tooltip
                    title={Array.from(
                      new Set(
                        data?.strelka_response?.flatMap(
                          (response) => response?.file?.name,
                        ),
                      ),
                    )
                      .slice(4)
                      .join(', ')}
                  >
                    <Tag
                      style={{
                        fontWeight: '500',
                        marginLeft: '30px',
                        fontSize: '12px',
                      }}
                      color={getColorForMimetypes(
                        data?.strelka_response[0]?.file?.flavors?.mime,
                      )}
                    >{`... and ${
                      Array.from(
                        new Set(
                          data?.strelka_response?.flatMap(
                            (response) => response?.file?.name,
                          ),
                        ),
                      ).slice(4).length
                    } more`}</Tag>
                  </Tooltip>
                )}
              </div>
            </Row>
          </div>
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginLeft: '8px' }}>
              {' '}
              <div style={{ marginBottom: '8px' }}>
                <StyledText style={{ paddingBottom: '4px' }}>
                  {data.submitted_description}
                </StyledText>
              </div>
              <InfoRow>
                <InfoLabel>MD5:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }} copyable>
                    {data.strelka_response[0]?.scan?.hash?.md5}
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>SHA1:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }} copyable>
                    {data.strelka_response[0]?.scan?.hash?.sha1}
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>SHA256:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }} copyable>
                    {data.strelka_response[0]?.scan?.hash?.sha256}
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>TLSH:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }} copyable>
                    {data.strelka_response[0]?.scan?.hash?.tlsh}
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Size:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }}>
                    {formatFileSize(data.file_size)}
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Submitter:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }}>
                    {data.user.first_name}.{data.user.last_name} (
                    {data.user.user_cn})
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Submitted:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }}>
                    {data.submitted_at}
                  </Text>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Files:</InfoLabel>
                <InfoContent>
                  <Text style={{ fontSize: 'small', color: '#888' }}>
                    {data.strelka_response.length}
                  </Text>
                </InfoContent>
              </InfoRow>
              {typeof virustotalData !== 'undefined' && virustotalData > -1 && (
                <InfoRow
                  onClick={
                    !isApiKeyAvailable ? undefined : handleVirusTotalClick
                  }
                >
                  <InfoLabel>VirusTotal:</InfoLabel>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: isApiKeyAvailable ? 'pointer' : 'default',
                      pointerEvents: isApiKeyAvailable ? 'auto' : 'none',
                    }}
                  >
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
                  </div>
                </InfoRow>
              )}
              <div style={{ marginTop: '8px' }}>
                {sortedScannersRun.map((tag) => (
                  <StyledTag style={{ fontSize: '10px' }} key={tag}>
                    {tag.toUpperCase().startsWith('SCAN')
                      ? tag.substring(4)
                      : tag}
                  </StyledTag>
                ))}
              </div>
            </div>
          </div>
          <div>
            <LeftWrapper $bgColor={color}>
              <IconComponent style={{ color: '#ffffff', fontSize: '36px' }} />
            </LeftWrapper>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HeaderOverviewCard

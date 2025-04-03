import {
  CameraOutlined,
  LockOutlined,
  QrcodeOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import { Handle, Position } from '@xyflow/react'
import { Tag, Tooltip, theme } from 'antd'
import { memo, useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { antdColors } from '../../../utils/colors'
import { getIconConfig } from '../../../utils/iconMappingTable'
import type { StrelkaNodeData } from '../../../utils/indexDataUtils'

const { useToken } = theme

// Helper Functions
function lightenHexColor(hexColor: string, factor: number): string {
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)

  const newR = Math.round(r + (255 - r) * factor)
    .toString(16)
    .padStart(2, '0')
  const newG = Math.round(g + (255 - g) * factor)
    .toString(16)
    .padStart(2, '0')
  const newB = Math.round(b + (255 - b) * factor)
    .toString(16)
    .padStart(2, '0')

  return `#${newR}${newG}${newB}`
}

// Styled Components
const LockIndicatorWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 15px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid ${antdColors.red};
  background: ${antdColors.lightRed};
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const UnlockIndicatorWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 15px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid ${antdColors.darkGreen};
  background: ${antdColors.lightGreen};
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const QrCodePreviewWrapper = styled.div<{ hasImage: boolean }>`
  position: absolute;
  bottom: 10px;
  right: ${({ hasImage }) => (hasImage ? '40px' : '10px')};
  width: 24px;
  height: 24px;
  border-radius: 20%;
  background-color: #ff7a45;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

const PulsatingAnimation = createGlobalStyle`
  @keyframes pulsate {
    0% {
      box-shadow: 0 0 5px rgba(255,0,0,0.4);
    }
    50% {
      box-shadow: 0 0 20px rgba(255,0,0,0.6), 0 0 30px rgba(255,0,0,0.8);
    }
    100% {
      box-shadow: 0 0 5px rgba(255,0,0,0.4);
    }
  }
`

const ImagePreviewWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 20%;
  background-color: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

const ImageTooltip = styled(Tooltip)`
  .ant-tooltip-inner {
    max-width: 100%;
    max-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    overflow: hidden; 
  }
  .ant-tooltip-inner img {
    pointer-events: auto;
  }
`

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`

const TagWrapper = styled.div`
  display: inline-block;
  margin-right: 10px;
  position: absolute;
  top: -15px;
  z-index: 10;
  letter-spacing: 0.5px;
`

const VirustotalWrapper = styled.div`
  position: absolute;
  top: -15px;
  right: -10px;
  z-index: 10;
  letter-spacing: 0.5px;
`

const NodeWrapper = styled.div<{
  $nodeAlert?: boolean
  $glow?: boolean
  $bgColor?: string
}>`
  position: relative;
  width: 450px;
  height: 100px;
  border-radius: 8px;
  ${(props) =>
    props.$nodeAlert &&
    `
  animation: pulsate 2s infinite;
`}
  ${(props) =>
    props.$glow
      ? `0px 0px 10px 5px ${lightenHexColor(props.$bgColor || '#91caff', 0.5)}`
      : '0px 1px 8px 0px rgba(0, 0, 0, 0.06)'}; // Glow effect for selected nodes
  padding: 8px 10px;
  display: flex;
  align-items: center;
`

const LeftWrapper = styled.div<{ $bgColor?: string }>`
  width: 44px;
  height: 44px;
  background-color: ${({ $bgColor }) => $bgColor || '#91caff'};
  border-radius: 6px;
  flex: 0 0 44px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const RightWrapper = styled.div<{ $acColor?: string }>`
  flex: 1 1 auto;
  text-align: left;
  margin-left: 12px;
  p {
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 500;
  }
  .node-header {
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 2px;
    line-height: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 350px;
  }
  .node-label {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 350px;
  }
  .node-sub {
    color: ${({ $acColor }) => $acColor};
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.1px;
    font-weight: 400;
  }
  .node-groups {
    line-height: 1.2;
    margin-top: 3px;
  }
`

// -------------------------
// Main Component
// -------------------------

interface EventNodeProps {
  data: StrelkaNodeData
  selected: boolean
}

const EventNode = memo(({ data, selected }: EventNodeProps) => {
  const [isBlurred] = useState(!!data.nodeQrData)
  const [vtStatus, setVtStatus] = useState('...')
  const [vtColor, setVtColor] = useState<
    'default' | 'success' | 'warning' | 'error'
  >('default')

  const previewStyle = isBlurred ? { filter: 'blur(4px)' } : {}

  const { token } = useToken()

  const mappingEntry = getIconConfig(
    'strelka',
    data.nodeMain[0]?.toLowerCase() || '',
  )
  const IconComponent = mappingEntry?.icon
  const color = mappingEntry?.color || data.color
  const hasImage = Boolean(data.nodeImage)
  const virusTotalResponse = data?.nodeVirustotal
  const tlshResponse = data.nodeTlshData?.family

  useEffect(() => {
    if (typeof virusTotalResponse === 'number') {
      if (!virusTotalResponse || virusTotalResponse === -1) {
        setVtStatus('Not Found on VirusTotal')
        setVtColor('success')
      } else if (virusTotalResponse === -3) {
        setVtStatus('Exceeded VirusTotal Limit')
        setVtColor('warning')
      } else if (virusTotalResponse > 5) {
        setVtStatus(`${virusTotalResponse} Positives`)
        setVtColor('error')
      } else {
        setVtStatus('Benign')
        setVtColor('success')
      }
    } else {
      setVtStatus('Not Found on VirusTotal')
      setVtColor('success')
    }
  }, [virusTotalResponse])

  data.nodeAlert =
    typeof virusTotalResponse === 'number' && virusTotalResponse > 5

  return (
    <NodeWrapper
      $glow={selected}
      $bgColor={color}
      $nodeAlert={data.nodeAlert}
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: `0px 3px 3px -2px ${token.colorBorder}, 0px 3px 4px 0px ${token.colorBorder}, 0px 1px 8px 0px ${token.colorBorder}`,
      }}
    >
      {<PulsatingAnimation />}
      {data.nodeIocs && (
        <TagWrapper style={{ left: '-5px' }}>
          <Tag color="purple">
            <strong>Potential IOCs: {data.nodeIocs}</strong>
          </Tag>
        </TagWrapper>
      )}
      {data.nodeInsights && (
        <TagWrapper style={{ left: data.nodeIocs ? '135px' : '-5px' }}>
          <Tag color="blue">
            <strong>Insights: {data.nodeInsights}</strong>
          </Tag>
        </TagWrapper>
      )}
      {data.nodeDepth !== 0 && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            border: 'None',
            background: 'None',
            bottom: '10%',
            transform: 'translate(30%, -50%)',
          }}
        />
      )}
      <LeftWrapper $bgColor={color}>
        {IconComponent ? (
          <IconComponent style={{ color: '#ffffff', fontSize: '36px' }} />
        ) : (
          <p>{data.nodeMain[0]}</p>
        )}
      </LeftWrapper>
      <RightWrapper $acColor={'#999094'}>
        <Tooltip title={data.nodeMain.join(', ')} placement="topLeft">
          <p className="node-header">{data.nodeMain.join(', ')}</p>
        </Tooltip>
        <Tooltip title={data.nodeLabel} placement="topLeft">
          <p className="node-label">{data.nodeLabel}</p>
        </Tooltip>

        <p className="node-sub">{data.nodeSub}</p>
        <div className="node-groups">
          <Tag color="default">
            {data.nodeMetric} {data.nodeMetricLabel}
          </Tag>
          {tlshResponse && (
            <Tag
              style={{
                margin: '2px',
                fontWeight: '500',
                fontSize: '11px',
              }}
              color="red"
            >
              TLSH Related Match:{' '}
              {`${tlshResponse.slice(0, 10)}${
                tlshResponse.length > 10 ? '...' : ''
              }`}
            </Tag>
          )}
        </div>
      </RightWrapper>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          backgroundColor: '#aaa',
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1px solid #bbb',
          bottom: '10%',
          transform: 'translate(30%, -50%)',
        }}
      />
      <VirustotalWrapper>
        <Tag color={vtColor}>
          <b>{vtStatus}</b>
        </Tag>
      </VirustotalWrapper>
      {data.nodeDecryptionSuccess === false && (
        <Tooltip title="Failed to decrypt files. Password not provided or could not be cracked.">
          <LockIndicatorWrapper>
            <LockOutlined style={{ color: antdColors.red, fontSize: '16px' }} />
          </LockIndicatorWrapper>
        </Tooltip>
      )}
      {data.nodeDecryptionSuccess === true && (
        <Tooltip title="Successfully decrypted files.">
          <UnlockIndicatorWrapper>
            <UnlockOutlined
              style={{ color: antdColors.darkGreen, fontSize: '16px' }}
            />
          </UnlockIndicatorWrapper>
        </Tooltip>
      )}
      {data.nodeQrData && (
        <Tooltip title="QR Code found">
          <QrCodePreviewWrapper hasImage={hasImage}>
            <QrcodeOutlined style={{ color: 'white' }} />
          </QrCodePreviewWrapper>
        </Tooltip>
      )}
      {data.nodeImage && (
        <ImageTooltip
          color="white"
          placement="left"
          title={
            <PreviewImage
              src={`data:image/jpeg;base64,${data.nodeImage}`}
              alt="Image Preview"
              style={previewStyle}
            />
          }
        >
          <ImagePreviewWrapper>
            <CameraOutlined style={{ color: 'white' }} />
          </ImagePreviewWrapper>
        </ImageTooltip>
      )}
    </NodeWrapper>
  )
})

export default EventNode

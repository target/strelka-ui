import {
  BaseEdge,
  EdgeLabelRenderer,
  type Position,
  getBezierPath,
} from '@xyflow/react'
import { theme } from 'antd'
import styled from 'styled-components'
import { antdColors } from '../../../utils/colors'

const { useToken } = theme

const EdgeLabel = styled.div<{ $markerColor: string }>`
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: ${(props) => (props.$markerColor !== antdColors.lightGray ? '700' : '500')};
  line-height: 12px;
  padding: 2px 4px;
  border-radius: 3px;
  pointer-events: all;
`

export interface IndexConnectEdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  style?: React.CSSProperties
  label?: React.ReactNode
  isHighlighted?: boolean
}

export function IndexConnectEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  isHighlighted,
}: IndexConnectEdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Move label closer to the target node
  const labelOffsetX = (targetX - sourceX) * 0.3
  const labelOffsetY = (targetY - sourceY) * 0.3
  const { token } = useToken()

  const markerColor = isHighlighted
    ? antdColors.darkGray
    : (style.stroke as string)

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={`url(#marker-arrow-${id})`}
        markerStart={`url(#marker-circle-${id}-start)`}
        style={style}
      />
      <EdgeLabelRenderer>
        <EdgeLabel
          style={{
            transform: `translate(-100%, -50%) translate(${
              labelX + labelOffsetX
            }px,${labelY + labelOffsetY}px)`,
            backgroundColor: token.colorBgContainer,
            boxShadow: `0 2px 5px ${token.colorBorder}`,
            border: `1px solid ${token.colorBorder}`,
            color: markerColor,
          }}
          className="nodrag nopan"
          $markerColor={markerColor}
        >
          {label}
        </EdgeLabel>
      </EdgeLabelRenderer>
      <svg width="0" height="0">
        <defs>
          <marker
            id={`marker-arrow-${id}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
            fill={markerColor}
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
      </svg>
    </>
  )
}

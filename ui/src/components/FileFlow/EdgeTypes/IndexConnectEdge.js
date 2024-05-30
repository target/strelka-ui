import React from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow";
import styled from "styled-components";
import { antdColors } from "../../../utils/colors";

const EdgeLabel = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: ${(props) => (props.$markerColor !== antdColors.lightGray ? "700" : "500")};
  line-height: 12px;
  color: ${(props) => props.$markerColor};
  background: white;
  padding: 2px 4px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  pointer-events: all;
`;

export default function CustomEdge({
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
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Move label closer to the target node
  const labelOffsetX = (targetX - sourceX) * 0.3;
  const labelOffsetY = (targetY - sourceY) * 0.3;

  const markerColor = isHighlighted ? antdColors.darkGray : style.stroke;
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
          $markerColor={markerColor}
          style={{
            transform: `translate(-100%, -50%) translate(${
              labelX + labelOffsetX
            }px,${labelY + labelOffsetY}px)`,
            backgroundColor: "white",
          }}
          className="nodrag nopan"
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
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  isNode,
  useEdgesState,
  useNodesState,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import { initialEdges, initialNodes } from '../../data/initialData.js'
import { IndexConnectEdge } from './EdgeTypes/IndexConnectEdge'
import EventNode from './NodeTypes/EventNode.js'
import '@xyflow/react/dist/style.css'
import ClickGuide from '../../utils/ClickGuide.jsx'
import ExceededGuide from '../../utils/ExceededGuide.jsx'
import NodeSearchPanel from '../../utils/NodeSearchPanel.jsx'
import ShowFileListing from '../../utils/ShowFileListing.jsx'
import { antdColors } from '../../utils/colors.js'
import { getDagreLayout } from '../../utils/dagreLayout.js'
import DownloadImage from '../../utils/downloadImage.jsx'
import {
  toggleChildrenVisibility,
  transformElasticSearchDataToElements,
} from '../../utils/layoutUtils.ts'

import { useDarkModeSetting } from '../../hooks/useDarkModeSetting.ts'
import type { NodeData } from '../../utils/indexDataUtils.ts'
import type { StrelkaResponse } from '../../services/api.types.ts'

const nodeTypes = {
  event: EventNode,
}

const edgeTypes = {
  indexedge: IndexConnectEdge,
}

const snapGrid: [number, number] = [16, 16]

interface FileTreeCardProps {
  data: StrelkaResponse[]
  alertId: string
  onNodeSelect: (record: NodeData) => void
  fileTypeFilter?: string
  fileYaraFilter?: string
  fileIocFilter?: string
  fileNameFilter?: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  selectedNodeData: any
  setSelectedNodeData: (data: NodeData) => void
}

const FileTreeCard: React.FC<FileTreeCardProps> = ({
  data,
  onNodeSelect,
  fileTypeFilter,
  fileYaraFilter,
  fileIocFilter,
  fileNameFilter,
  selectedNodeData,
  setSelectedNodeData,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { fitView } = useReactFlow()

  const layoutedElements = useMemo(
    () => getDagreLayout(initialNodes, initialEdges),
    [],
  )
  const layoutedNodes = layoutedElements.filter(isNode) as Node[]
  const layoutedEdges = layoutedElements.filter((el) => !isNode(el))
  const [nodes, setNodes] = useNodesState(layoutedNodes)
  const [edges, setEdges] = useEdgesState(layoutedEdges)
  const showClickGuide = !selectedNodeData
  const [showExceededGuide, setShowExceededGuide] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const [highlightedEdge, setHighlightedEdge] = useState<string | null>(null)
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)

  useEffect(() => {
    const vtExceeded = data.some((item) => {
      return item?.enrichment?.virustotal === -3
    })
    setShowExceededGuide(vtExceeded)
  }, [data])

  const onSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes))
    },
    [setNodes],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges))
    },
    [setEdges],
  )

  const filteredNodes = useMemo(() => {
    let nodesToFilter = fileTypeFilter
      ? nodes.filter((node) =>
          (node.data as unknown as NodeData).nodeMain.includes(fileTypeFilter),
        )
      : nodes

    if (fileNameFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        (node.data as unknown as NodeData).nodeRelationshipId?.includes(
          fileNameFilter,
        ),
      )
    }
    if (fileYaraFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        (node.data as unknown as NodeData).nodeYaraList?.includes(
          fileYaraFilter,
        ),
      )
    }

    if (fileIocFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        (node.data as { nodeIocList?: string }).nodeIocList?.includes(
          fileIocFilter,
        ),
      )
    }

    if (searchTerm.trim()) {
      nodesToFilter = nodesToFilter.filter(
        (node) =>
          typeof node.data.nodeLabel === 'string' &&
          node.data.nodeLabel.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return nodesToFilter
  }, [
    nodes,
    searchTerm,
    fileTypeFilter,
    fileIocFilter,
    fileYaraFilter,
    fileNameFilter,
  ])

  useEffect(() => {
    fitView({ padding: 0.2 })
  }, [fitView])

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    if (node.type === 'index') {
      const rootNodeIds = nodes
        .filter((n) => n.type === 'index')
        .map((n) => n.id)

      const relatedEdges = edges.filter((edge) => edge.source === node.id)

      const relatedNodes = relatedEdges.map((edge) => edge.target)

      const firstRelatedNode = nodes.find((n) => n.id === relatedNodes[0])
      const shouldBeHidden = firstRelatedNode && !firstRelatedNode.hidden

      let updatedNodes = [...nodes]
      let updatedEdges = [...edges]
      const rootNodeIdsSet = new Set(rootNodeIds)

      updatedEdges = updatedEdges.map((edge) => {
        if (edge.source === node.id && !rootNodeIdsSet.has(edge.target)) {
          return { ...edge, hidden: shouldBeHidden }
        }
        return edge
      })

      for (const relatedNodeId of relatedNodes) {
        const result = toggleChildrenVisibility(
          relatedNodeId,
          updatedNodes,
          updatedEdges,
          shouldBeHidden,
          rootNodeIdsSet,
        )
        updatedNodes = result.nodesList
        updatedEdges = result.edgesList
      }

      setNodes(updatedNodes)
      setEdges(updatedEdges)
    } else {
      setSelectedNodeData(node.data as unknown as NodeData)
      onNodeSelect(node.data.record as unknown as NodeData)
    }
  }

  const handleNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const relatedEdge = edges.find((edge) => edge.target === node.id)
      if (relatedEdge) {
        setHighlightedEdge(relatedEdge.id)
        setHighlightedNode(node.id)
      }
    },
    [edges],
  )

  const handleNodeMouseLeave = useCallback(() => {
    setHighlightedEdge(null)
    setHighlightedNode(null)
  }, [])

  const highlightedEdges = edges.map((edge) => {
    const isHighlighted = edge.id === highlightedEdge
    return {
      ...edge,
      style: {
        ...edge.style,
        stroke: isHighlighted ? antdColors.darkGray : antdColors.lightGray,
        strokeWidth: isHighlighted ? 2 : 2,
      },
      data: { ...edge.data, isHighlighted },
    }
  })

  const highlightedNodes = filteredNodes.map((node) => {
    if (node.id === highlightedNode) {
      return {
        ...node,
        style: {
          ...node.style,
          boxShadow: '0 0 10px 3px rgba(1,1,0,0.5)',
        },
      }
    }
    return node
  })

  useEffect(() => {
    const { nodes: transformedNodes, edges: transformedEdges } =
      transformElasticSearchDataToElements(data)

    const nodesToLayout = transformedNodes.filter(isNode)
    const edgesToLayout = transformedEdges.filter((el) => !isNode(el))

    const layoutedData = getDagreLayout(nodesToLayout, edgesToLayout)

    setNodes(layoutedData.filter(isNode))
    setEdges(layoutedData.filter((el) => !isNode(el)))
  }, [data, setEdges, setNodes])

  const { isDarkMode } = useDarkModeSetting()
  const colorMode = isDarkMode ? 'dark' : 'light'

  return (
    <div
      style={{
        width: '100%',
        height: '80vh',
        border: '5px solid rgba(0, 0, 0, 0.02)',
        borderRadius: '10px',
      }}
    >
      <ReactFlow
        ref={ref}
        nodes={highlightedNodes}
        edges={highlightedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        maxZoom={1}
        minZoom={0.1}
        colorMode={colorMode}
      >
        <MiniMap
          nodeColor={(n) => n.data.color as string}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Controls />
        <NodeSearchPanel onSearchChange={onSearchChange} />
        <Background />
        <DownloadImage />
        <ShowFileListing nodes={filteredNodes} />
        {showClickGuide && <ClickGuide />}
        {showExceededGuide && <ExceededGuide />}
      </ReactFlow>
    </div>
  )
}

export default FileTreeCard

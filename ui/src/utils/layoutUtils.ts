import type { Edge, Node } from '@xyflow/react'
import type { StrelkaResponse } from '../services/api.types'
import { getIconConfig } from './iconMappingTable'
import {
  type StrelkaNodeData,
  indexDataType,
  indexNodeType,
} from './indexDataUtils'

// Recursive function to count all descendants of a node under the same INDEX
function countDescendants(nodeId, nodeIndex, nodes, edges) {
  const childEdges = edges.filter((edge) => edge.source === nodeId)
  let total = 0

  for (const edge of childEdges) {
    const childNode = nodes.find((n) => n.id === edge.target)
    if (childNode && childNode.data.nodeIndex === nodeIndex) {
      total++
      total += countDescendants(childNode.id, nodeIndex, nodes, edges)
    }
  }

  return total
}

export const toggleChildrenVisibility = (
  currentNodeId,
  _nodesList,
  _edgesList,
  shouldBeHidden,
  processedNodes,
) => {
  if (processedNodes.has(currentNodeId)) {
    return { nodesList: _nodesList, edgesList: _edgesList }
  }
  processedNodes.add(currentNodeId)

  const currentNode = _nodesList.find((node) => node.id === currentNodeId)
  if (currentNode.type === 'index') {
    return { nodesList: _nodesList, edgesList: _edgesList } // stop recursion down this branch
  }

  const childrenEdges = _edgesList.filter(
    (edge) => edge.source === currentNodeId,
  )
  const childrenNodes = childrenEdges.map((edge) => edge.target)

  let nodesList = _nodesList.map((node) => {
    if (node.id === currentNodeId && node.type !== 'index') {
      return { ...node, hidden: shouldBeHidden }
    }
    return node
  })

  let edgesList = _edgesList.map((edge) => {
    if (childrenEdges.some((e) => e.id === edge.id)) {
      return { ...edge, hidden: shouldBeHidden }
    }
    return edge
  })

  for (const childNodeId of childrenNodes) {
    const results = toggleChildrenVisibility(
      childNodeId,
      nodesList,
      edgesList,
      shouldBeHidden,
      processedNodes,
    )
    nodesList = results.nodesList
    edgesList = results.edgesList
  }

  return { nodesList: nodesList, edgesList: _edgesList }
}

export function transformElasticSearchDataToElements(
  results: StrelkaResponse[],
) {
  const nodes: Node<StrelkaNodeData>[] = []
  const edges: Edge[] = []
  const rootNodes = new Set()
  const nodeIdsToIndices = new Map()
  let qrDataPresent = false

  for (const result of results) {
    if (result.scan?.qr?.data) {
      qrDataPresent = true
    }
  }

  for (const result of results) {
    result.index = 'strelka'
    const nodeData = indexDataType(result.index, result)
    const nodeType = indexNodeType(result.index)

    // Add node ID and its corresponding index-ID to the map
    nodes.push({
      id: `${result.index}-${result.file.tree.node}`,
      data: {
        record: result,
        label: result.file.tree.node,
        color: getIconConfig('strelka', nodeData.nodeMain[0].toLowerCase())
          .color,
        nodeIndex: result.index,
        nodeDepth: nodeData.nodeDepth,
        nodeVirustotal: nodeData.nodeVirustotal,
        nodeInsights: nodeData.nodeInsights,
        nodeIocs: nodeData.nodeIocs,
        nodeImage: nodeData.nodeImage,
        nodeQrData: qrDataPresent ? nodeData.nodeQrData : undefined,
        nodeDecryptionSuccess: nodeData.nodeDecryptionSuccess,
        nodeMain: nodeData.nodeMain,
        nodeSub: nodeData.nodeSub,
        nodeLabel: nodeData.nodeLabel,
        nodeMetric: nodeData.nodeMetric,
        nodeTlshData: nodeData.nodeTlshData,
        nodeMetricLabel: nodeData.nodeMetricLabel,
        nodeYaraList: nodeData.nodeYaraList,
        nodeIocList: nodeData.nodeIocList,
        nodeParentId: nodeData.nodeParentId,
        nodeRelationshipId: nodeData.nodeRelationshipId,
        nodeAlert: false,
        nodeDatatype: nodeData.nodeDatatype,
        nodeDisposition: nodeData.nodeDisposition,
        nodeSource: result.file.source,
      },
      position: { x: -100, y: 100 },
      type: nodeType,
    })

    nodeIdsToIndices.set(result.file.tree.node, nodeData.nodeRelationshipId)

    if (nodeData.nodeParentId === undefined) {
      edges.push({
        id: `${result.index}-root-${result.index}-${result.file.tree.node}`,
        source: `${result.index}-root`,
        target: `${result.index}-${result.file.tree.node}`,
        sourceHandle: 'root',
      })
    }
  }

  // Add Possible Relationship Edges
  for (const node of nodes) {
    // Extract the relevant details from the node's data
    const { nodeParentId, nodeIndex } = node.data
    const keyForNodeParentId = Array.from(nodeIdsToIndices.entries()).find(
      ([_, value]) => value === nodeParentId,
    )?.[0]

    if (keyForNodeParentId) {
      edges.push({
        id: `${keyForNodeParentId}-${node.id}`,
        source: `${nodeIndex}-${keyForNodeParentId}`,
        target: node.id,
        animated: false,
        type: 'indexedge',
        label: `${node.data.nodeSource}`,
      })
    }
  }

  // Update the number of descendants for each root node under the same INDEX
  for (const node of nodes) {
    if (node.type === 'index') {
      node.data.childrenCount = countDescendants(
        node.id,
        node.data.label,
        nodes,
        edges,
      )
    }
  }

  // Identify root nodes that are connected to non-root nodes
  for (const edge of edges) {
    if (rootNodes.has(edge.source) && !rootNodes.has(edge.target)) {
      rootNodes.delete(edge.source)
    }

    if (rootNodes.has(edge.target) && !rootNodes.has(edge.source)) {
      rootNodes.delete(edge.target)
    }
  }

  // Update the edges connected to root nodes without non-root children
  for (const edge of edges) {
    if (rootNodes.has(edge.source) || rootNodes.has(edge.target)) {
      edge.animated = true
    }
  }

  return {
    nodes,
    edges,
  }
}

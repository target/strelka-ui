import type { Edge, Node } from '@xyflow/react'
import dagre from 'dagre'
import type { StrelkaNodeData } from './indexDataUtils'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const getDagreLayout = (nodes: Node<StrelkaNodeData>[], edges: Edge[]) => {
  const graph = new dagre.graphlib.Graph()
  graph.setGraph({ rankdir: 'LR' })
  graph.setDefaultEdgeLabel(() => ({}))

  for (const node of nodes) {
    graph.setNode(node.id, { width: 650, height: 100 })
  }

  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target)
  }

  dagre.layout(graph)

  // Get nodes with computed positions
  const positionedNodes = nodes.map((node) => {
    return {
      ...node,
      position: graph.node(node.id),
    }
  })

  // Sort nodes by `nodeMain` after layout (this is the mimetype so we can group like files)
  positionedNodes.sort((a, b) => {
    const aValue = a.data?.nodeMain[0] || ''
    const bValue = b.data?.nodeMain[0] || ''
    return aValue.localeCompare(bValue)
  })

  // Adjust the y positions to reflect the sorting order
  const heightOffset = 150 // This changes the vertical spacing between the nodes
  positionedNodes.forEach((node, index) => {
    node.position.y = index * heightOffset
  })

  // Prepare the layouted elements with adjusted positions
  const layoutedElements: (Node<StrelkaNodeData> | Edge)[] =
    positionedNodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x - 550 / 2,
        y: node.position.y - heightOffset / 2,
      },
    }))

  // Include the edges in the layout
  layoutedElements.push(...edges)

  return layoutedElements
}

export { getDagreLayout }

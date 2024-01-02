import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const getDagreLayout = (nodes, edges) => {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: "LR" });
  graph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: 550, height: 100 });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

// Get nodes with computed positions
const positionedNodes = nodes.map(node => {
  return {
    ...node,
    position: graph.node(node.id)
  };
});

// Sort nodes by `nodeMain` after layout (this is the mimetype so we can group like files)
positionedNodes.sort((a, b) => {
  const aValue = a.data?.nodeMain || '';
  const bValue = b.data?.nodeMain || '';
  return aValue.localeCompare(bValue);
});

// Adjust the y positions to reflect the sorting order
const heightOffset = 150; // This changes the vertical spacing between the nodes
positionedNodes.forEach((node, index) => {
  node.position.y = index * heightOffset;
});

// Prepare the layouted elements with adjusted positions
const layoutedElements = positionedNodes.map(node => ({
  ...node,
  position: {
    x: node.position.x - 550 / 2,
    y: node.position.y - heightOffset / 2,
  },
}));

// Include the edges in the layout
layoutedElements.push(...edges);

return layoutedElements;
};

export { getDagreLayout };
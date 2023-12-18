
 

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

  const layoutedElements = [];
  nodes.forEach((node) => {
    const nodeWithPosition = graph.node(node.id);
    layoutedElements.push({
      ...node,
      position: {
        x: nodeWithPosition.x - 450 / 2,
        y: nodeWithPosition.y - 150 / 2,
      },
    });
  });

  edges.forEach((edge) => {
    layoutedElements.push(edge);
  });

  return layoutedElements;
};

export { getDagreLayout };
import { getIconConfig } from "./iconMappingTable";
import { indexDataType, indexNodeType } from "./indexDataUtils";

// Recursive function to count all descendants of a node under the same INDEX
function countDescendants(
  nodeId,
  nodeIndex,
  nodes,
  edges
) {
  const childEdges = edges.filter((edge) => edge.source === nodeId);
  let total = 0;

  childEdges.forEach((edge) => {
    const childNode = nodes.find((n) => n.id === edge.target);
    if (childNode && childNode.data.nodeIndex === nodeIndex) {
      total++; 
      total += countDescendants(childNode.id, nodeIndex, nodes, edges);
    }
  });

  return total;
}

export const toggleChildrenVisibility = (
  currentNodeId,
  nodesList,
  edgesList,
  shouldBeHidden,
  processedNodes
) => {
  if (processedNodes.has(currentNodeId)) {
    return { nodesList, edgesList };
  }
  processedNodes.add(currentNodeId);

  const currentNode = nodesList.find(
    (node) => node.id === currentNodeId
  );
  if (currentNode.type === "index") {
    return { nodesList, edgesList }; // stop recursion down this branch
  }

  const childrenEdges = edgesList.filter(
    (edge) => edge.source === currentNodeId
  );
  const childrenNodes = childrenEdges.map(
    (edge) => edge.target
  );

  nodesList = nodesList.map((node) => {
    if (node.id === currentNodeId && node.type !== "index") {
      return { ...node, hidden: shouldBeHidden };
    }
    return node;
  });

  edgesList = edgesList.map(
    (edge) => {
      if (childrenEdges.some((e) => e.id === edge.id)) {
        return { ...edge, hidden: shouldBeHidden };
      }
      return edge;
    }
  );

  childrenNodes.forEach((childNodeId) => {
    const results = toggleChildrenVisibility(
      childNodeId,
      nodesList,
      edgesList,
      shouldBeHidden,
      processedNodes
    );
    nodesList = results.nodesList;
    edgesList = results.edgesList;
  });

  return { nodesList, edgesList };
};

export function transformElasticSearchDataToElements(results) {
  const nodes = [];
  const edges = [];
  let rootNodes = new Set();
  let nodeIdsToIndices = new Map();
  

    results.forEach((result) => {
      result.index = "strelka"
      const nodeData = indexDataType(result.index, result);
      const nodeType = indexNodeType(result.index)

      // Add node ID and its corresponding index-ID to the map
      nodes.push({
        id: `${result.index}-${result.file.tree.node}`,
        data: {
          record: result,
          label: result.file.tree.node,
          color: getIconConfig('strelka', nodeData.nodeMain.toLowerCase()).color,
          nodeIndex: result.index,
          nodeDepth: nodeData.nodeDepth,
          nodeVirustotal: nodeData.nodeVirustotal,
          nodeInsights: nodeData.nodeInsights,
          nodeIocs: nodeData.nodeIocs,
          nodeImage: nodeData.nodeImage,
          nodeQrData: nodeData.nodeQrData,
          nodeMain: nodeData.nodeMain,
          nodeSub: nodeData.nodeSub,
          nodeLabel: nodeData.nodeLabel,
          nodeMetric: nodeData.nodeMetric,
          nodeMetricLabel: nodeData.nodeMetricLabel,
          nodeYaraList: nodeData.nodeYaraList,
          nodeParentId: nodeData.nodeParentId,
          nodeRelationshipId: nodeData.nodeRelationshipId,
          nodeAlert: false,
          nodeDatatype: nodeData.nodeDatatype,
          nodeDisposition: nodeData.nodeDisposition
        },
        position: { x: -100, y: 100 },
        type: nodeType,
      });

      nodeIdsToIndices.set(result.file.tree.node, nodeData.nodeRelationshipId);

      if (nodeData.nodeParentId === undefined) {
        edges.push({
          id: `${result.index}-root-${result.index}-${result.file.tree.node}`,
          source: `${result.index}-root`,
          target: `${result.index}-${result.file.tree.node}`,
          sourceHandle: "root",
        });
      }
    });
 

  // Add Possible Relationship Edges
  nodes.forEach((node) => {
    // Extract the relevant details from the node's data
    const { nodeParentId, nodeIndex } = node.data;
    const keyForNodeParentId = Array.from(nodeIdsToIndices.entries()).find(
      ([_, value]) => value === nodeParentId
    )?.[0];

    if (keyForNodeParentId) {
      edges.push({
        id: `${keyForNodeParentId}-${node.id}`,
        source: `${nodeIndex}-${keyForNodeParentId}`,
        target: node.id,

        sourceHandle: "relationship",
      });
    }
  });

  // Update the number of descendants for each root node under the same INDEX
  nodes.forEach((node) => {
    if (node.type === "index") {
      node.data.childrenCount = countDescendants(
        node.id,
        node.data.label,
        nodes,
        edges
      );
    }
  });

  // Identify root nodes that are connected to non-root nodes
  edges.forEach((edge) => {
    if (rootNodes.has(edge.source) && !rootNodes.has(edge.target)) {
      rootNodes.delete(edge.source);
    }
    if (rootNodes.has(edge.target) && !rootNodes.has(edge.source)) {
      rootNodes.delete(edge.target);
    }
  });

  // Update the edges connected to root nodes without non-root children
  edges.forEach((edge) => {
    if (rootNodes.has(edge.source) || rootNodes.has(edge.target)) {
      edge.label = "false";
      edge.animated = "true";
    }
  });

  return {
    nodes,
    edges,
  };
}
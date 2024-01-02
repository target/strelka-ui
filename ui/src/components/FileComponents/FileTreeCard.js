// -------------------------
// Imports
// -------------------------
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import ReactFlow, {
  Background,
  isNode,
  useEdgesState,
  useNodesState,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  useReactFlow,
} from "reactflow";
import EventNode from "../FileFlow/NodeTypes/EventNode.js";
import IndexConnectEdge from "../FileFlow/EdgeTypes/IndexConnectEdge.js";
import { initialNodes, initialEdges } from "../../data/initialData.js";
import "reactflow/dist/style.css";
import { getDagreLayout } from "../../utils/dagreLayout.js";
import DownloadImage from "../../utils/downloadImage";
import ShowFileListing from "../../utils/ShowFileListing";
import NodeSearchPanel from "../../utils/NodeSearchPanel";
import ClickGuide from "../../utils/ClickGuide";
import ExceededGuide from "../../utils/ExceededGuide.js";

import {
  toggleChildrenVisibility,
  transformElasticSearchDataToElements,
} from "../../utils/layoutUtils.js";

// -------------------------
// Node & Edge Definitions
// -------------------------
const nodeTypes = {
  event: EventNode,
};

const edgeTypes = {
  indexedge: IndexConnectEdge,
};
const snapGrid = [16, 16];

// -------------------------
// Main Component
// -------------------------
const FileTreeCard = ({
  data,
  alertId,
  onNodeSelect,
  fileTypeFilter,
  fileYaraFilter,
  fileNameFilter,
  selectedNodeData,
  setSelectedNodeData,
}) => {
  // -------------------------
  // State Definitions
  // -------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const { fitView } = useReactFlow();

  const layoutedElements = useMemo(
    () => getDagreLayout(initialNodes, initialEdges),
    []
  );
  const layoutedNodes = layoutedElements.filter(isNode);
  const layoutedEdges = layoutedElements.filter((el) => !isNode(el));
  const [nodes, setNodes] = useNodesState(layoutedNodes);
  const [edges, setEdges] = useEdgesState(layoutedEdges);
  const showClickGuide = !selectedNodeData;
  const [showExceededGuide, setShowExceededGuide] = useState(false);
  const ref = useRef(null);

  // -------------------------
  // Callbacks
  // -------------------------

  // Handler for updating showVtExceededGuide based on data
  useEffect(() => {
    const vtExceeded = data.some((item) => {
      return item?.enrichment?.virustotal === -3;
    });
    setShowExceededGuide(vtExceeded);
  }, [data]);

  // Handler to use the setSearchTerm / search filter
  const onSearchChange = (search) => {
    setSearchTerm(search);
  };

  // Handler to update nodes when they change.
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
    },
    [setNodes]
  );

  // Handler to update edges when they change.
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
    },
    [setEdges]
  );

  const filteredNodes = useMemo(() => {
    // Start with all nodes or nodes that match the file type filter
    let nodesToFilter = fileTypeFilter
      ? nodes.filter((node) => node.data.nodeMain.includes(fileTypeFilter))
      : nodes;

    // Apply the file name filter if it's set
    if (fileNameFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        node.data.nodeRelationshipId?.includes(fileNameFilter)
      );
    }

    // Apply the yara filter if it's set
    if (fileYaraFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        node.data.nodeYaraList?.includes(fileYaraFilter)
      );
    }

    // If the search term is not empty, further filter the nodes
    if (searchTerm.trim()) {
      nodesToFilter = nodesToFilter.filter(
        (node) =>
          typeof node.data.nodeLabel === "string" &&
          node.data.nodeLabel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return nodesToFilter;
  }, [nodes, searchTerm, fileTypeFilter, fileYaraFilter, fileNameFilter]);

  // Reset View when filters are applied
  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [fileTypeFilter, fileYaraFilter, fileNameFilter, fitView]);

  // Handler for when a node is clicked.
  const handleNodeClick = (event, node) => {
    if (node.type === "index") {
      // Gather all nodes of type 'index'. This type I'm using as a "root" node for now.
      const rootNodeIds = nodes
        .filter((n) => n.type === "index")
        .map((n) => n.id);

      // Gather all edges related to the clicked node.
      const relatedEdges = edges.filter((edge) => edge.source === node.id);

      // Identify the nodes connected to the clicked node through the edges.
      const relatedNodes = relatedEdges.map((edge) => edge.target);

      // Determine if the first related node is hidden.
      const firstRelatedNode = nodes.find((n) => n.id === relatedNodes[0]);
      const shouldBeHidden = firstRelatedNode && !firstRelatedNode.hidden;

      let updatedNodes = [...nodes];
      let updatedEdges = [...edges];
      const rootNodeIdsSet = new Set(rootNodeIds);

      // Update visibility of the edges connected to the clicked node.
      updatedEdges = updatedEdges.map((edge) => {
        if (edge.source === node.id && !rootNodeIdsSet.has(edge.target)) {
          return { ...edge, hidden: shouldBeHidden };
        }
        return edge;
      });

      // Update visibility for nodes related to the clicked node.
      relatedNodes.forEach((relatedNodeId) => {
        const result = toggleChildrenVisibility(
          relatedNodeId,
          updatedNodes,
          updatedEdges,
          shouldBeHidden,
          rootNodeIdsSet
        );
        updatedNodes = result.nodesList;
        updatedEdges = result.edgesList;
      });

      setNodes(updatedNodes);
      setEdges(updatedEdges);
    } else {
      // If node type is not 'index', display node data in a modal.
      setSelectedNodeData(node.data);
      onNodeSelect(node.data.record);
    }
  };

  // Effect to layout nodes and edges based on the API data.
  useEffect(() => {
    // Transform the raw API data to nodes and edges.
    const { nodes: transformedNodes, edges: transformedEdges } =
      transformElasticSearchDataToElements(data, alertId);

    // Separate nodes and edges for layout.
    const nodesToLayout = transformedNodes.filter(isNode);
    const edgesToLayout = transformedEdges.filter((el) => !isNode(el));

    // Apply a layout algorithm (e.g., Dagre) to position nodes and edges.
    const layoutedData = getDagreLayout(nodesToLayout, edgesToLayout);

    // Find the first node and store its index
    // const firstNode = layoutedData.find(isNode);

    // Update state with the positioned nodes and edges and select the first node
    setNodes(layoutedData.filter(isNode));
    setEdges(layoutedData.filter((el) => !isNode(el)));

    // // Select the first node by calling handleNodeClick
    // if (firstNode) {
    //   handleNodeClick(null, firstNode);
    // }
  }, [alertId, data, setEdges, setNodes]);

  // -------------------------
  // Render
  // -------------------------
  return (
    <div
      style={{
        width: "100%",
        height: "50vh",
        border: "5px solid rgba(0, 0, 0, 0.02)",
        borderRadius: "10px",
      }}
    >
      <ReactFlow
        ref={ref}
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        maxZoom={1}
        minZoom={0.1}
      >
        <MiniMap
          nodeColor={(n) => n.data.color}
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
  );
};

export default FileTreeCard;

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
import EventNode from "./NodeTypes/EventNode.js";
import IndexConnectEdge from "./EdgeTypes/IndexConnectEdge.js";
import { initialNodes, initialEdges } from "../../data/initialData.js";
import "reactflow/dist/style.css";
import { getDagreLayout } from "../../utils/dagreLayout.js";
import DownloadImage from "../../utils/downloadImage.js";
import ShowFileListing from "../../utils/ShowFileListing.js";
import NodeSearchPanel from "../../utils/NodeSearchPanel.js";
import ClickGuide from "../../utils/ClickGuide.js";
import ExceededGuide from "../../utils/ExceededGuide.js";
import {
  toggleChildrenVisibility,
  transformElasticSearchDataToElements,
} from "../../utils/layoutUtils.js";
import { antdColors } from "../../utils/colors";

const nodeTypes = {
  event: EventNode,
};

const edgeTypes = {
  indexedge: IndexConnectEdge,
};

const snapGrid = [16, 16];

const FileTreeCard = ({
  data,
  alertId,
  onNodeSelect,
  fileTypeFilter,
  fileYaraFilter,
  fileIocFilter,
  fileNameFilter,
  selectedNodeData,
  setSelectedNodeData,
}) => {
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

  const [highlightedEdge, setHighlightedEdge] = useState(null);
  const [highlightedNode, setHighlightedNode] = useState(null);

  useEffect(() => {
    const vtExceeded = data.some((item) => {
      return item?.enrichment?.virustotal === -3;
    });
    setShowExceededGuide(vtExceeded);
  }, [data]);

  const onSearchChange = (search) => {
    setSearchTerm(search);
  };

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
    },
    [setEdges]
  );

  const filteredNodes = useMemo(() => {
    let nodesToFilter = fileTypeFilter
      ? nodes.filter((node) => node.data.nodeMain.includes(fileTypeFilter))
      : nodes;

    if (fileNameFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        node.data.nodeRelationshipId?.includes(fileNameFilter)
      );
    }
    if (fileYaraFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        node.data.nodeYaraList?.includes(fileYaraFilter)
      );
    }

    if (fileIocFilter) {
      nodesToFilter = nodesToFilter.filter((node) =>
        node.data.nodeIocList?.includes(fileIocFilter)
      );
    }

    if (searchTerm.trim()) {
      nodesToFilter = nodesToFilter.filter(
        (node) =>
          typeof node.data.nodeLabel === "string" &&
          node.data.nodeLabel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return nodesToFilter;
  }, [
    nodes,
    searchTerm,
    fileTypeFilter,
    fileIocFilter,
    fileYaraFilter,
    fileNameFilter,
  ]);

  useEffect(() => {
    fitView({ padding: 0.2 });
  }, [fileTypeFilter, fileYaraFilter, fileNameFilter, fitView]);

  const handleNodeClick = (event, node) => {
    if (node.type === "index") {
      const rootNodeIds = nodes
        .filter((n) => n.type === "index")
        .map((n) => n.id);

      const relatedEdges = edges.filter((edge) => edge.source === node.id);

      const relatedNodes = relatedEdges.map((edge) => edge.target);

      const firstRelatedNode = nodes.find((n) => n.id === relatedNodes[0]);
      const shouldBeHidden = firstRelatedNode && !firstRelatedNode.hidden;

      let updatedNodes = [...nodes];
      let updatedEdges = [...edges];
      const rootNodeIdsSet = new Set(rootNodeIds);

      updatedEdges = updatedEdges.map((edge) => {
        if (edge.source === node.id && !rootNodeIdsSet.has(edge.target)) {
          return { ...edge, hidden: shouldBeHidden };
        }
        return edge;
      });

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
      setSelectedNodeData(node.data);
      onNodeSelect(node.data.record);
    }
  };

  const handleNodeMouseEnter = useCallback(
    (event, node) => {
      const relatedEdge = edges.find((edge) => edge.target === node.id);
      if (relatedEdge) {
        setHighlightedEdge(relatedEdge.id);
        setHighlightedNode(node.id);
      }
    },
    [edges]
  );

  const handleNodeMouseLeave = useCallback(() => {
    setHighlightedEdge(null);
    setHighlightedNode(null);
  }, []);

  const highlightedEdges = edges.map((edge) => {
    const isHighlighted = edge.id === highlightedEdge;
    return {
      ...edge,
      style: {
        ...edge.style,
        stroke: isHighlighted ? antdColors.darkGray : antdColors.lightGray,
        strokeWidth: isHighlighted ? 2 : 2,
      },
      data: { ...edge.data, isHighlighted },
    };
  });

  const highlightedNodes = filteredNodes.map((node) => {
    if (node.id === highlightedNode) {
      return {
        ...node,
        style: {
          ...node.style,
          boxShadow: "0 0 10px 3px rgba(1,1,0,0.5)",
        },
      };
    }
    return node;
  });

  useEffect(() => {
    const { nodes: transformedNodes, edges: transformedEdges } =
      transformElasticSearchDataToElements(data, alertId);

    const nodesToLayout = transformedNodes.filter(isNode);
    const edgesToLayout = transformedEdges.filter((el) => !isNode(el));

    const layoutedData = getDagreLayout(nodesToLayout, edgesToLayout);

    setNodes(layoutedData.filter(isNode));
    setEdges(layoutedData.filter((el) => !isNode(el)));
  }, [alertId, data, setEdges, setNodes]);

  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        border: "5px solid rgba(0, 0, 0, 0.02)",
        borderRadius: "10px",
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

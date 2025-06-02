import { useState, useCallback, useEffect, useRef } from "react";

import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGraph } from "./hooks";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const hasLoaded = useRef(false);
  const {
    updateEdgesInDb,
    addNodeToDb,
    getEnitiesFromDb,
    resetDb,
    updateNodesInDb,
  } = useGraph();

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const getSavedEnities = async () => {
      const { edges: savedEdges, nodes: savedNodes } = await getEnitiesFromDb();
      if (savedEdges.length || savedNodes.length) {
        const result = await confirm("Восстановить предыдущие данные?");
        if (result) {
          setNodes(savedNodes);
          setEdges(savedEdges);
        } else {
          resetDb();
        }
      }
    };
    getSavedEnities();
  }, []);
  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      updateEdgesInDb(newEdges);
    },
    [edges, setEdges]
  );

  const onNodesChangeInternal = useCallback(
    (changes) => {
      const changedNodes = applyNodeChanges(changes, nodes);
      setNodes(changedNodes);
      updateNodesInDb(changedNodes);
      console.log("Changed nodes:", changedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChangeInternal = useCallback(
    (changes) => {
      const changedEdges = applyEdgeChanges(changes, edges);
      setEdges(changedEdges);
      updateEdgesInDb(changedEdges);
    },
    [edges, setEdges]
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((nds) => nds.concat(newNode));
    addNodeToDb(newNode);
  }, [nodes, setNodes]);
  const getAll = useCallback(() => {
    getEnitiesFromDb().then(console.log);
  }, []);
  const resetStore = useCallback(() => {
    resetDb();
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeInternal}
          onEdgesChange={onEdgesChangeInternal}
          onConnect={onConnect}
        >
          <Panel>
            <button onClick={addNode}>Add Node</button>
            <button onClick={getAll}>Get All</button>
            <button onClick={resetStore}>Delete Store</button>
          </Panel>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default App;

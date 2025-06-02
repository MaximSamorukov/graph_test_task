import { useCallback, useEffect, useRef, useState } from "react";
import * as Comlink from "comlink";
import type { Edge, Node } from "@xyflow/react";

import GraphWorker from "@/workers/graph.worker?worker";
import type { GraphApi } from "@/workers/graph.worker";

export const useGraph = () => {
  const [workerIsReady, setWorkerIsReady] = useState(false);
  const apiRef = useRef<Comlink.Remote<GraphApi> | null>(null);
  useEffect(() => {
    const worker = new GraphWorker();
    const init = async () => {
      apiRef.current = Comlink.wrap<GraphApi>(worker);
      setWorkerIsReady(true);
    };
    init();

    return () => {
      worker.terminate();
    };
  }, []);

  const updateEdgesInDb = useCallback(async (edges: Edge[]) => {
    await apiRef.current?.updateEdges(edges);
  }, []);
  const updateNodesInDb = useCallback(async (nodes: Node[]) => {
    await apiRef.current?.updateNodes(nodes);
  }, []);

  const addNodeToDb = useCallback(async (node) => {
    await apiRef.current?.addNode(node);
  }, []);
  const resetDb = useCallback(async () => {
    await apiRef.current?.resetDb();
  }, []);

  const getEnitiesFromDb = useCallback(async () => {
    const { edges, nodes } = (await apiRef.current?.getEntities()) || {
      edges: [],
      nodes: [],
    };
    return { edges, nodes };
  }, []);

  return {
    updateEdgesInDb,
    updateNodesInDb,
    addNodeToDb,
    resetDb,
    getEnitiesFromDb,
    workerIsReady,
  };
};

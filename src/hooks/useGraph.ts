import { useCallback } from "react";
import type { Edge, Node } from "@xyflow/react";
import { itemsDb } from "@/db/db";

export const useGraph = () => {
  const updateEdgesInDb = useCallback(async (edges: Edge[]) => {
    await itemsDb.edges.clear();
    await itemsDb.edges.bulkAdd(edges);
  }, []);
  const updateNodesInDb = useCallback(async (nodes: Node[]) => {
    await itemsDb.nodes.clear();
    await itemsDb.nodes.bulkAdd(nodes);
  }, []);

  const addNodeToDb = useCallback(async (node) => {
    await itemsDb.nodes.add(node);
  }, []);
  const resetDb = useCallback(async () => {
    await itemsDb.nodes.clear();
    await itemsDb.edges.clear();
  }, []);

  const getEnitiesFromDb = useCallback(async () => {
    const edges = await itemsDb.edges.toArray();
    const nodes = await itemsDb.nodes.toArray();
    return { edges, nodes };
  }, []);

  return {
    updateEdgesInDb,
    updateNodesInDb,
    addNodeToDb,
    resetDb,
    getEnitiesFromDb,
  };
};

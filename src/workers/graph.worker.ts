import * as Comlink from "comlink";
import type { Edge, Node } from "@xyflow/react";
import { itemsDb } from "@/db/db";

const graphApi = {
  async updateEdges(edges: Edge[]) {
    await itemsDb.edges.clear();
    await itemsDb.edges.bulkAdd(edges);
  },
  async updateNodes(nodes: Node[]) {
    await itemsDb.nodes.clear();
    await itemsDb.nodes.bulkAdd(nodes);
  },
  async addNode(node: Node) {
    await itemsDb.nodes.add(node);
  },
  async resetDb() {
    await itemsDb.edges.clear();
    await itemsDb.nodes.clear();
  },
  async getEntities() {
    const edges = await itemsDb.edges.toArray();
    const nodes = await itemsDb.nodes.toArray();
    return { edges, nodes };
  },
};

Comlink.expose(graphApi);

export type GraphApi = {
  updateEdges: (edges: Edge[]) => Promise<void>;
  updateNodes: (nodes: Node[]) => Promise<void>;
  addNode: (node: Node) => Promise<void>;
  resetDb: () => Promise<void>;
  getEntities: () => Promise<{ edges: Edge[]; nodes: Node[] }>;
};

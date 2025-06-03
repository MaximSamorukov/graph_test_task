import type { Edge, Node } from "@xyflow/react";
import Dexie, { type Table } from "dexie";

export class ItemsDB extends Dexie {
  edges!: Table<Edge, number>;
  nodes!: Table<Node, number>;
  constructor() {
    super("ItemsDB");
    this.version(1).stores({
      edges: "++internalId, id",
      nodes: "++internalId, id",
    });
    this.edges = this.table("edges");
    this.nodes = this.table("nodes");
  }
}

export const itemsDb = new ItemsDB();

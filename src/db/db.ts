import type { Edge, Node } from "@xyflow/react";
import Dexie, { type Table } from "dexie";

export class ItemsDB extends Dexie {
  edges!: Table<Edge, number>;
  nodes!: Table<Node, number>;
  constructor() {
    super("ItemsDB");
    this.version(1).stores({
      edges: "id",
      nodes: "id",
    });
  }
}

export const itemsDb = new ItemsDB();

/// <reference path="../../index.d.ts" />
import type { ClioEdnServices, EventAdmission, GraphNode, GraphOperations } from "@open-hax/protocols";

// This consumer must type-check against the published declaration and run
// against the compiled provider without casts or mock graph operations.
export async function verifyGraphConsumer(graph: GraphOperations): Promise<void> {
  await graph["add-node"]({ id: "a", type: "concept", label: "Alpha" });
  await graph["add-node"]({ id: "b", type: "concept", label: "Beta" });
  await graph["add-edge"]({ source: "a", target: "b", type: "supports" });

  const neighbors: string[] = await graph["query-neighbors"]("a", {
    direction: "out", "edge-types": ["supports"],
  });
  if (neighbors.length !== 1 || neighbors[0].toUpperCase() !== "B") {
    throw new Error("Neighbor queries must expose node IDs as strings");
  }

  const nodes: GraphNode[] = await graph.traverse("a", { depth: 1 });
  if (nodes.length !== 2 || !nodes.some(node => node.id === "b" && node.label === "Beta")) {
    throw new Error("Traversal must expose full graph node records");
  }
}

export async function verifyServiceDefaults(services: ClioEdnServices): Promise<void> {
  const session = await services["create-session"]();
  if (typeof session.id !== "string") throw new Error("Default session requires an ID");
  const ids: string[] = await services["query-neighbors"]("a");
  const nodes: GraphNode[] = await services.traverse("a");
  const targets = await services["query-by-label"]("missing-label");
  if (ids[0] !== "b" || nodes.length !== 2 || targets.length !== 0) {
    throw new Error("Omitted option objects must use the protocol defaults");
  }
}

export function verifyImmediateWatchHandle(admission: EventAdmission): void {
  const handle = admission["watch-events"]({}, () => undefined);
  handle.close();
}

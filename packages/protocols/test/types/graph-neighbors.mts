/// <reference path="../../index.d.ts" />
import type { ClioEdnServices, EventAdmission, GraphNode, GraphOperations, Session, SubscriptionHandle, TranslationSegment } from "@open-hax/protocols";

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

export async function verifyCopiedSubscriptionHandle(services: ClioEdnServices): Promise<void> {
  const received: unknown[] = [];
  let observed = false;
  const original = services.subscribe("copied-handle-room", "changed", data => received.push(data));
  const copied: SubscriptionHandle = { id: original.id, close: original.close };
  let probe: SubscriptionHandle | undefined;
  try {
    services.unsubscribe(copied);
    services.unsubscribe(copied);
    probe = services.subscribe("copied-handle-room", "changed", () => { observed = true; });
    await services["emit-to-room"]("copied-handle-room", "changed", { proof: "still-active-probe" });
    const deadline = Date.now() + 3000;
    while (!observed && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    if (!observed) throw new Error("The live probe must observe the actual persisted notification");
    if (received.length !== 0) throw new Error("Unsubscribed copied handles must stop receiving notifications");
  } finally {
    original.close();
    probe?.close();
  }
}

export async function verifyEmissionResult(services: ClioEdnServices): Promise<void> {
  const pending: Promise<void> = services["emit-to-room"]("room", "changed", { n: 1 });
  if (await pending !== undefined) throw new Error("Emission acknowledgement must be void");
}

export async function verifyEmissionFailure(services: ClioEdnServices): Promise<void> {
  const pending: Promise<void> = services["emit-to-room"]("room", "changed", { n: 2 });
  const rejected = await pending.then(() => false, () => true);
  if (!rejected) throw new Error("Failed persistence must reject its emission acknowledgement");
}

export async function verifyGenericRecordConsumer(services: ClioEdnServices): Promise<void> {
  const node = await services["add-node"]({ label: 42 });
  const edge = await services["add-edge"]({});
  const document = await services["store-document"]({ content: "inspectable" });
  const translation = await services["create-translation"]({});
  const label = await services["create-label"]({});
  const session = await services["create-session"]({ "actor-id": 42 });
  const ids: string[] = [node.id, edge.id, document.id, translation.id, label.id, session.id];
  if (!ids.every(id => typeof id === "string")) throw new Error("Every admitted record requires a string identity");
  if (typeof document.content !== "string" || document.content.toUpperCase() !== "INSPECTABLE") {
    throw new Error("Generic document content must remain available after narrowing");
  }
  if (node.label !== 42) throw new Error("Application fields must preserve their supplied values");
  if (false) {
    // @ts-expect-error Application fields are unknown until narrowed.
    const nodeType: string = node.type;
    // @ts-expect-error Application fields are unknown until narrowed.
    const nodeLabel: string = node.label;
    // @ts-expect-error Application fields are unknown until narrowed.
    const endpoint: string = edge.source;
    // @ts-expect-error Document content is generic, not necessarily a map.
    const content: Record<string, unknown> = document.content;
    // @ts-expect-error Translation source need not be supplied.
    const source: string = translation.source;
    // @ts-expect-error Label name need not be supplied.
    const name: string = label.name;
    // @ts-expect-error Session actor IDs remain unvalidated application values.
    const actor: string = session["actor-id"];
    void [nodeType, nodeLabel, endpoint, content, source, name, actor];
  }
  const missingSession = await services["update-session"]("missing", {});
  const missingTranslation = await services["label-translation"]("missing", "accepted");
  if (false) {
    // @ts-expect-error An absent session update can return null.
    const presentSession: Session = missingSession;
    // @ts-expect-error An absent translation update can return null.
    const presentTranslation: TranslationSegment = missingTranslation;
    void [presentSession, presentTranslation];
  }
  if (missingSession !== null || missingTranslation !== null) throw new Error("Missing updates must return null");
}

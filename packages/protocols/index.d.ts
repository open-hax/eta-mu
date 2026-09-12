declare module "@open-hax/protocols" {
  // ---------------------------------------------------------------------------
  // Envelope helpers
  // ---------------------------------------------------------------------------

  export interface EventEnvelope {
    "event/type": string;
    "event/id"?: string;
    "event/time"?: string;
    "event/from"?: { "actor-id": string; "actor-kind": string; "actor-node"?: string };
    "event/to"?: { "actor-id": string; "actor-kind": string; "actor-node"?: string };
    "causal/root"?: string;
    "causal/parent"?: string;
    "session/id"?: string;
    "turn/id"?: string;
    "delivery/mode"?: "tell" | "ask" | "stream" | "ack-required";
    "delivery/id"?: string;
    payload?: Record<string, unknown>;
    contracts?: string[];
    expectations?: Record<string, unknown>;
  }

  export function makeEnvelope(
    eventType: string,
    payload: Record<string, unknown>
  ): EventEnvelope;

  export function validateEnvelope(envelope: unknown): {
    valid: boolean;
    errors?: string[];
  };

  // ---------------------------------------------------------------------------
  // Protocol: EventAdmission
  // ---------------------------------------------------------------------------

  export interface EventAdmission {
    "append-event!"(envelope: EventEnvelope): Promise<Record<string, unknown>>;
    "append-events!"(
      envelopes: EventEnvelope[]
    ): Promise<Record<string, unknown>[]>;
    "query-events"(filter: Record<string, unknown>): Promise<EventEnvelope[]>;
    "watch-events"(
      filter: Record<string, unknown>,
      callback: (event: EventEnvelope) => void
    ): { close(): void };
  }

  // ---------------------------------------------------------------------------
  // EdnFileEventAdmission — EDN file-backed implementation
  // ---------------------------------------------------------------------------

  export interface EdnFileEventAdmission extends EventAdmission {}

  export function createEdnEventAdmission(ledgerDir: string): EdnFileEventAdmission;

  export interface ClioEdnServices extends EventAdmission, SessionManagement,
    DocumentStorage, GraphOperations, TranslationManagement, LabelManagement,
    UserManagement, RealtimeSubscription {}

  export function createEdnServices(directory: string): ClioEdnServices;

  // ---------------------------------------------------------------------------
  // Protocol: SessionManagement
  // ---------------------------------------------------------------------------

  /** A persisted generic map. Narrow application fields before using them. */
  export interface StoredRecord {
    id: string;
    [field: string]: unknown;
  }

  export interface Session extends StoredRecord {
    "actor-id"?: unknown;
    createdAt: unknown;
    updatedAt: unknown;
    metadata?: unknown;
  }

  export interface SessionManagement {
    "create-session"(opts?: Record<string, unknown>): Promise<Session>;
    "get-session"(sessionId: string): Promise<Session | null>;
    "update-session"(
      sessionId: string,
      updates: Record<string, unknown>
    ): Promise<Session | null>;
    "close-session"(sessionId: string): Promise<void>;
  }

  // ---------------------------------------------------------------------------
  // Protocol: DocumentStorage
  // ---------------------------------------------------------------------------

  export interface StoredDocument extends StoredRecord {
    type?: unknown;
    content?: unknown;
    "created-at": unknown;
    "updated-at": unknown;
    archived?: unknown;
  }

  export interface DocumentStorage {
    "store-document"(doc: Record<string, unknown>): Promise<StoredDocument>;
    "get-document"(docId: string): Promise<StoredDocument | null>;
    "query-documents"(
      query: Record<string, unknown>
    ): Promise<StoredDocument[]>;
    "archive-document"(docId: string): Promise<void>;
  }

  // ---------------------------------------------------------------------------
  // Protocol: GraphOperations
  // ---------------------------------------------------------------------------

  export interface GraphNode extends StoredRecord {
    type?: unknown;
    label?: unknown;
    metadata?: unknown;
  }

  export interface GraphEdge extends StoredRecord {
    source?: unknown;
    target?: unknown;
    type?: unknown;
    metadata?: unknown;
  }

  export interface GraphOperations {
    "add-node"(node: Record<string, unknown>): Promise<GraphNode>;
    "add-edge"(edge: Record<string, unknown>): Promise<GraphEdge>;
    /** Returns neighboring node IDs; use traverse for full node records. */
    "query-neighbors"(
      nodeId: string,
      opts?: { direction?: "in" | "out" | "both"; "edge-types"?: string[] }
    ): Promise<string[]>;
    traverse(
      start: string,
      opts?: { depth?: number; "edge-types"?: string[] }
    ): Promise<GraphNode[]>;
  }

  // ---------------------------------------------------------------------------
  // Protocol: TranslationManagement
  // ---------------------------------------------------------------------------

  export interface TranslationSegment extends StoredRecord {
    source?: unknown;
    target?: unknown;
    "source-lang"?: unknown;
    "target-lang"?: unknown;
    label?: unknown;
  }

  export interface TranslationManagement {
    "create-translation"(
      translation: Record<string, unknown>
    ): Promise<TranslationSegment>;
    "label-translation"(
      segmentId: string,
      label: string
    ): Promise<TranslationSegment | null>;
    "batch-translate"(
      batch: Record<string, unknown>[]
    ): Promise<string>;
  }

  // ---------------------------------------------------------------------------
  // Protocol: LabelManagement
  // ---------------------------------------------------------------------------

  export interface Label extends StoredRecord {
    name?: unknown;
    color?: unknown;
    metadata?: unknown;
  }

  export interface LabelManagement {
    "create-label"(label: Record<string, unknown>): Promise<Label>;
    "apply-label"(
      labelId: string,
      targetId: string,
      targetType: string
    ): Promise<void>;
    "query-by-label"(
      labelId: string,
      opts?: { "target-type"?: string[] }
    ): Promise<Array<Record<string, unknown>>>;
  }

  // ---------------------------------------------------------------------------
  // Protocol: UserManagement
  // ---------------------------------------------------------------------------

  export interface User extends StoredRecord {
    username: string;
    email?: unknown;
    "created-at": string;
    metadata?: unknown;
  }

  export interface UserManagement {
    "create-user"(userData: Record<string, unknown>): Promise<EventEnvelope>;
    authenticate(credentials: Record<string, unknown>): Promise<EventEnvelope>;
    "get-user"(userId: string): Promise<User | null>;
    "update-user"(
      userId: string,
      updates: Record<string, unknown>
    ): Promise<EventEnvelope>;
  }

  // ---------------------------------------------------------------------------
  // Protocol: RealtimeSubscription
  // ---------------------------------------------------------------------------

  export interface SubscriptionHandle {
    id: string;
    close(): void;
  }

  export interface RealtimeSubscription {
    subscribe(
      room: string,
      eventType: string,
      callback: (data: unknown) => void
    ): SubscriptionHandle;
    unsubscribe(handle: SubscriptionHandle): void;
    "emit-to-room"(
      room: string,
      eventType: string,
      data: unknown
    ): Promise<void>;
  }
}

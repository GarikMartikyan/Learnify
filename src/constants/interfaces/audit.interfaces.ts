/** Who performed an action. Names are null if the Auth service could not be reached. */
export interface IAuditActor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

/** One entry of the admin audit log (GET /admin/audit-log on the Audit service). */
export interface IAuditLogEntry {
  id: string;
  /** Null for system actions. */
  actor: IAuditActor | null;
  /** "entity.verb", e.g. "user.role_changed". */
  action: string;
  /** e.g. "user", "teacher_application". */
  entityType: string;
  entityId: string | null;
  /** Readable name of the affected entity if known (e.g. the user's full name), else null. */
  entityName: string | null;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
}

/** Values for the filter dropdowns (only values that occur in the log). */
export interface IAuditFilters {
  actions: string[];
  entityTypes: string[];
  actors: IAuditActor[];
}

/** Every filter is optional. from is inclusive, to is exclusive (ISO date-times). */
export interface IAuditLogQuery {
  action?: string;
  entityType?: string;
  actorId?: string;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

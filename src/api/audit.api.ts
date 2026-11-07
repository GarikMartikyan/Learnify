import { createApi } from "@reduxjs/toolkit/query/react";

import { apiUrls, createBaseQuery } from "./index.api.ts";
import type { IPage } from "../constants/interfaces/user.interfaces.ts";
import type {
  IAuditFilters,
  IAuditLogEntry,
  IAuditLogQuery,
} from "../constants/interfaces/audit.interfaces.ts";

/** Endpoints of the Audit service (port 8084). Admin only. */
export const auditApi = createApi({
  reducerPath: "auditApi",
  baseQuery: createBaseQuery(apiUrls.audit),
  // The log changes whenever someone acts, so always load it fresh
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getAuditLog: builder.query<IPage<IAuditLogEntry>, IAuditLogQuery>({
      query: (params) => ({ url: "/admin/audit-log", params }),
    }),

    getAuditFilters: builder.query<IAuditFilters, void>({
      query: () => "/admin/audit-log/filters",
    }),
  }),
});

export const { useGetAuditLogQuery, useGetAuditFiltersQuery } = auditApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { message } from "antd";

import { rtkTags } from "../constants/rtkTags.ts";
import { getAccessTokenLS } from "../services/localStorage.service.ts";

const baseUrl = import.meta.env.VITE_BASE_API_URL || "/api";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = getAccessTokenLS();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandling: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result: Awaited<ReturnType<typeof baseQuery>> = await baseQuery(
    args,
    api,
    extraOptions,
  );

  if (result.error) {
    const { status } = result.error;
    if (status === 401) {
      //TODO: fix auth
      console.error("Error: 401");
    }

    //TODO: fix error message
    message.error("Error");
  }

  return result;
};

export const api = createApi({
  tagTypes: Object.values(rtkTags),
  reducerPath: "dashboardBTMSApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});

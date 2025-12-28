import { apiRequest } from "./client";
import {
  type FilmsStatsResponse,
  type PubStatsDetail,
  type PubStatsResponse,
  type RevenueStatsResponse,
  type StatsQueryParams,
  type UsersStatsResponse,
} from "@/types/api/stats";

export const statsApi = {
  films: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<FilmsStatsResponse>("/stats/films", { params, accessToken }),

  revenue: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<RevenueStatsResponse>("/stats/revenue", { params, accessToken }),

  users: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<UsersStatsResponse>("/stats/users", { params, accessToken }),

  pub: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<PubStatsResponse>("/stats/pub", { params, accessToken }),

  pubDetail: (id: string, accessToken?: string) =>
    apiRequest<PubStatsDetail>(`/stats/pub/${id}`, { accessToken }),
};

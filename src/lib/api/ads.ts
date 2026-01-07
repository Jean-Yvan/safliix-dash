import { apiRequest } from "./client";
import { type AdsListParams, type AdsListResponse } from "@/types/api/ads";

export const adsApi = {
  list: (params?: AdsListParams, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<AdsListResponse>("/admin/ads", { params: params as Record<string, string | number | boolean | null | undefined> | undefined, accessToken, signal }),
};

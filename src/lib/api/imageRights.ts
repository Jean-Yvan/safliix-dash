import { apiRequest } from "./client";
import {
  type CreateRightsHolderPayload,
  type ImageRightsHolderDetail,
  type RightsHolderListParams,
  type RightsHolderListResponse,
} from "@/types/api/imageRights";

export const imageRightsApi = {
  list: (params: RightsHolderListParams, accessToken?: string) =>
    apiRequest<RightsHolderListResponse>("/rights-holders", { params, accessToken }),

  detail: (id: string, accessToken?: string) =>
    apiRequest<ImageRightsHolderDetail>(`/rights-holders/${id}`, { accessToken }),

  create: (payload: CreateRightsHolderPayload, accessToken?: string) =>
    apiRequest<ImageRightsHolderDetail>("/rights-holders", { method: "POST", body: payload, accessToken }),
};

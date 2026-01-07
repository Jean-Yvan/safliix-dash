import { apiRequest } from "./client";
import {
  type CreateSubscriptionPayload,
  type CreateSubscriptionResponse,
  type PlanDetail,
  type PlanListParams,
  type PlanListResponse,
  type PlanPayload,
  type SubscriptionListParams,
  type SubscriptionListResponse,
} from "@/types/api/subscriptions";

export const plansApi = {
  list: (params: PlanListParams, accessToken?: string) =>
    apiRequest<PlanListResponse>("/plans", { params, accessToken }),

  detail: (id: string, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<PlanDetail>(`/plans/${id}`, { accessToken, signal }),

  create: (payload: PlanPayload, accessToken?: string) =>
    apiRequest<{ id: string }>("/plans", { method: "POST", body: payload, accessToken }),

  update: (id: string, payload: PlanPayload, accessToken?: string) =>
    apiRequest<{ id: string }>(`/plans/${id}`, { method: "PUT", body: payload, accessToken }),
};

export const subscriptionsApi = {
  list: (params: SubscriptionListParams, accessToken?: string) =>
    apiRequest<SubscriptionListResponse>("/subscriptions", { params, accessToken }),

  create: (payload: CreateSubscriptionPayload, accessToken?: string) =>
    apiRequest<CreateSubscriptionResponse>("/subscriptions", { method: "POST", body: payload, accessToken }),
};

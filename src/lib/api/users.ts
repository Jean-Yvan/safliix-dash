import { apiRequest } from "./client";
import { UserPayload, type UserListParams, type UserListResponse, type UserProfile, type UserUpdatePayload } from "@/types/api/users";

export const usersApi = {
  list: (params: UserListParams, accessToken?: string) =>
    apiRequest<UserListResponse>("/users", { params, accessToken }),

  create: (payload:UserPayload, accessToken?:string,signal?:AbortSignal) =>
    apiRequest<void>("/users", {method:"POST", body:payload, accessToken, signal }),

  delete: (id:string, accessToken?:string, signal?:AbortSignal) =>
    apiRequest<void>(`/users/${id}`,{ method:"DELETE", accessToken, signal}),

  detail: (id: string, accessToken?: string) =>
    apiRequest<UserProfile>(`/users/${id}`, { accessToken }),

  update: (id: string, payload: UserUpdatePayload, accessToken?: string) =>
    apiRequest<UserProfile>(`/users/${id}`, { method: "PATCH", body: payload, accessToken })
};

import { apiRequest } from "./client";
import { type UserListParams, type UserListResponse, type UserProfile, type UserUpdatePayload } from "@/types/api/users";

export const usersApi = {
  list: (params: UserListParams, accessToken?: string) =>
    apiRequest<UserListResponse>("/users", { params, accessToken }),

  detail: (id: string, accessToken?: string) =>
    apiRequest<UserProfile>(`/users/${id}`, { accessToken }),

  update: (id: string, payload: UserUpdatePayload, accessToken?: string) =>
    apiRequest<UserProfile>(`/users/${id}`, { method: "PATCH", body: payload, accessToken })
};

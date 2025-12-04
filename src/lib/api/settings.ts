import { apiRequest } from "./client";
import { type SettingsPayload, type SettingsResponse } from "@/types/api/settings";

export const settingsApi = {
  get: (accessToken?: string) => apiRequest<SettingsResponse>("/settings", { accessToken }),
  update: (payload: SettingsPayload, accessToken?: string) =>
    apiRequest<SettingsResponse>("/settings", { method: "PUT", body: payload, accessToken }),
};

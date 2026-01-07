import { type PaginatedResponse } from "./common";

export type AdminStatus = "active" | "inactive" | "suspended" | string;
export type AdminRole = "admin" | "editor" | "viewer" | string;

export interface AdminListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: AdminStatus;
  role?: AdminRole;
}

export interface AdminListItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: AdminStatus;
  role?: AdminRole;
  avatar?: string;
  createdAt?: string;
}

export type AdminListResponse = PaginatedResponse<AdminListItem>;

export interface AdminProfile extends AdminListItem {
  activity?: unknown[];
  subscriptions?: unknown[];
  transactions?: unknown[];
}

export interface AdminUpdatePayload {
  status?: AdminStatus;
  role?: AdminRole;
  profile?: Record<string, unknown>;
}

import { apiRequest } from "./client";
import {
  type CreateRightsHolderPayload,
  type ImageRightsHolderDetail,
  type RightsHolderContentItem,
  type RightsHolderContentsGroup,
  type RightsHolderListParams,
  type RightsHolderContentType,
  type RightsHolderContentsResponse,
  type RightsHolderContentsListResponse,
  type RightsHolderListResponse,
} from "@/types/api/imageRights";

export const imageRightsApi = {
  list: (params: RightsHolderListParams, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<RightsHolderListResponse>("/rights-holders", { params, accessToken, signal }),

  detail: (id: string, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<ImageRightsHolderDetail>(`/rights-holders/${id}`, { accessToken, signal }),

  create: (payload: CreateRightsHolderPayload, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<ImageRightsHolderDetail>("/rights-holders", { method: "POST", body: payload, accessToken, signal }),

  contents: (id: string, type: RightsHolderContentType, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<RightsHolderContentsResponse>(`/api/rights-holders/${id}/contents`, {
      params: { type },
      accessToken,
      signal,
    }),

  contentsList: (
    type: RightsHolderContentType,
    accessTokenOrOptions?: string | { accessToken?: string; signal?: AbortSignal; from?: string; to?: string },
    signal?: AbortSignal,
  ) => {
    const options = typeof accessTokenOrOptions === "string" ? { accessToken: accessTokenOrOptions, signal } : accessTokenOrOptions || {};
    const { accessToken, from, to, signal: finalSignal } = options;
    return apiRequest<RightsHolderContentsListResponse | RightsHolderContentsGroup[] | RightsHolderContentsResponse[]>(
      "/rights-holders/contents",
      { params: { type, from, to }, accessToken, signal: finalSignal },
    );
  },
};

export type NormalizedRightsHolderGroup<T = RightsHolderContentItem> = {
  rightsholderId: string;
  rightsholderName: string;
  items: T[];
};

export function normalizeRightsHolderGroups<T = unknown>(
  res: RightsHolderContentsListResponse | RightsHolderContentsGroup[] | RightsHolderContentsResponse[] | unknown,
): NormalizedRightsHolderGroup<T>[] {
  const pickItems = (...candidates: unknown[]): any[] => {
    for (const c of candidates) {
      if (Array.isArray(c) && c.length > 0) return c;
    }
    for (const c of candidates) {
      if (Array.isArray(c)) return c;
    }
    return [];
  };
  const collectArrayValues = (value: unknown): any[] => {
    if (!value || typeof value !== "object") return [];
    return Object.values(value as Record<string, unknown>).flatMap((v) => (Array.isArray(v) ? v : []));
  };
  const toGroups = (items: any[]): NormalizedRightsHolderGroup<T>[] => {
    const map = new Map<string, NormalizedRightsHolderGroup<T>>();
    items.forEach((item) => {
      const name = item.rightsholderName || item.rightHolderName || item.rightHolder || item.name || "Ayant droit inconnu";
      const id =
        item.rightsholderId ||
        item.rightHolderId ||
        item.rightHolder ||
        name ||
        "unknown";
      if (!map.has(id)) {
        map.set(id, { rightsholderId: String(id), rightsholderName: name, items: [] });
      }
      map.get(id)!.items.push(item as T);
    });
    return Array.from(map.values());
  };

  if (res && typeof res === "object" && "success" in (res as Record<string, unknown>) && Array.isArray((res as any).data)) {
    res = (res as any).data;
  }
  if (
    res &&
    typeof res === "object" &&
    "success" in (res as Record<string, unknown>) &&
    !Array.isArray((res as any).data) &&
    (res as any).data
  ) {
    res = (res as any).data;
  }
  if (res && typeof res === "object" && "data" in (res as Record<string, unknown>) && (res as any).data) {
    res = (res as any).data;
  }

  if (Array.isArray(res) && res.length > 0) {
    const looksLikeHolder = res.some(
      (h) =>
        h &&
        typeof h === "object" &&
        (Array.isArray((h as any).movies) || Array.isArray((h as any).series) || Array.isArray((h as any).films)),
    );
    if (looksLikeHolder) {
      return (res as any[]).map((holder) => {
        const nameParts = [holder.firstName, holder.lastName].filter(Boolean).join(" ").trim();
        return {
          rightsholderId:
            holder.rightsholderId ||
            holder.rightHolderId ||
            holder.id ||
            holder.name ||
            "unknown",
          rightsholderName:
            holder.rightsholderName ||
            holder.rightHolderName ||
            holder.name ||
            holder.fullName ||
            nameParts ||
            "Ayant droit inconnu",
          items: pickItems(holder.items, holder.contents, holder.series, holder.movies, holder.films) as T[],
        };
      });
    }
  }

  const maybeArray = Array.isArray(res) ? res : undefined;
  const rawGroups =
    (res as any)?.rightsholders ||
    (res as any)?.rightsHolders ||
    (res as any)?.groups ||
    (res as any)?.holders ||
    (maybeArray ? maybeArray : undefined);
  const rawItems = (res as any)?.items || (res as any)?.contents;
  if (rawItems && !Array.isArray(rawItems) && typeof rawItems === "object") {
    const entries = Object.entries(rawItems as Record<string, unknown>);
    if (entries.length > 0) {
      return entries.map(([key, value]) => ({
        rightsholderId: key || "unknown",
        rightsholderName: key || "Ayant droit inconnu",
        items: Array.isArray(value)
          ? (value as T[])
          : (pickItems(
              (value as any)?.items,
              (value as any)?.contents,
              (value as any)?.series,
              (value as any)?.movies,
              (value as any)?.films,
            ) as T[]),
      }));
    }
  }

  if (rawGroups && !Array.isArray(rawGroups) && typeof rawGroups === "object") {
    const entries = Object.entries(rawGroups as Record<string, unknown>);
    if (entries.length > 0) {
      return entries.map(([key, value]) => ({
        rightsholderId: key || "unknown",
        rightsholderName: key || "Ayant droit inconnu",
        items: Array.isArray(value)
          ? (value as T[])
          : (pickItems(
              (value as any)?.items,
              (value as any)?.contents,
              (value as any)?.series,
              (value as any)?.movies,
              (value as any)?.films,
            ) as T[]),
      }));
    }
  }
  if (res && typeof res === "object" && !Array.isArray(res)) {
    const arrays = collectArrayValues(res);
    if (arrays.length > 0) {
      return toGroups(arrays);
    }
  }

  const normalizeMapLike = (value: unknown) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") return Object.values(value as Record<string, unknown>);
    return undefined;
  };

  const normalizedGroups = normalizeMapLike(rawGroups);
  const normalizedItems = normalizeMapLike(rawItems);

  if (Array.isArray(normalizedGroups) && normalizedGroups.length > 0) {
    const firstHasChildren = normalizedGroups.some((g) => Array.isArray((g as any).items) || Array.isArray((g as any).contents));
    if (firstHasChildren) {
      return (normalizedGroups as any[]).map((g) => ({
        rightsholderId: g.rightsholderId || g.rightHolderId || g.id || g.name || "unknown",
        rightsholderName: g.rightsholderName || g.rightHolderName || g.name || "Ayant droit inconnu",
        items: pickItems(g.items, g.contents, g.series, g.movies, g.films) as T[],
      }));
    }
    return toGroups(normalizedGroups as any[]);
  }

  if (Array.isArray(normalizedItems) && normalizedItems.length > 0) {
    const firstHasChildren = normalizedItems.some((g) => Array.isArray((g as any).items) || Array.isArray((g as any).contents));
    if (firstHasChildren) {
      return (normalizedItems as any[]).map((g) => ({
        rightsholderId: g.rightsholderId || g.rightHolderId || g.id || g.name || "unknown",
        rightsholderName: g.rightsholderName || g.rightHolderName || g.name || "Ayant droit inconnu",
        items: pickItems(g.items, g.contents, g.series, g.movies, g.films) as T[],
      }));
    }
    return toGroups(normalizedItems as any[]);
  }

  return [];
}

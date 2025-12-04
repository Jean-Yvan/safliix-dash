import { apiRequest } from "./client";
import {
  type FilmActionPayload,
  type FilmActionResponse,
  type FilmCreateOrUpdateResponse,
  type FilmDetail,
  type FilmListParams,
  type FilmListResponse,
  type FilmMetadataPayload,
  type FilmMetaOptionsResponse,
  type FilmUploadFileDescriptor,
  type FilmUploadFinalizePayload,
  type FilmUploadSlot,
} from "@/types/api/films";

export const filmsApi = {
  list: (params: FilmListParams, accessToken?: string) =>
    apiRequest<FilmListResponse>("/films", {
      params,
      accessToken,
    }),

  detail: (id: string, accessToken?: string) => apiRequest<FilmDetail>(`/films/${id}`, { accessToken }),

  create: (payload: FilmMetadataPayload, accessToken?: string) =>
    apiRequest<FilmCreateOrUpdateResponse>("/films", {
      method: "POST",
      body: payload,
      accessToken,
    }),

  update: (id: string, payload: FilmMetadataPayload, accessToken?: string) =>
    apiRequest<FilmCreateOrUpdateResponse>(`/films/${id}`, {
      method: "PUT",
      body: payload,
      accessToken,
    }),

  performAction: (id: string, payload: FilmActionPayload, accessToken?: string) =>
    apiRequest<FilmActionResponse>(`/films/${id}/actions`, {
      method: "POST",
      body: payload,
      accessToken,
    }),

  presignUploads: (id: string, files: FilmUploadFileDescriptor[], accessToken?: string) =>
    apiRequest<FilmUploadSlot[]>(`/films/${id}/uploads/presign`, {
      method: "POST",
      body: { files },
      accessToken,
    }),

  finalizeUploads: (id: string, payload: FilmUploadFinalizePayload, accessToken?: string) =>
    apiRequest<{ ok: boolean }>(`/films/${id}/uploads/finalize`, {
      method: "POST",
      body: payload,
      accessToken,
    }),

  metaOptions: (accessToken?: string) =>
    apiRequest<FilmMetaOptionsResponse>("/films/meta/options", { accessToken }),
};

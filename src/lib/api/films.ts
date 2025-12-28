import { apiRequest } from "./client";
import {
  type FilmActionPayload,
  type FilmActionResponse,
  type FilmCreateOrUpdateResponse,
  type FilmDetail,
  type FilmListParams,
  type FilmListResponse,
  type FilmMetadataPayload,
  type FilmMetaOptions,
  type FilmUploadFileDescriptor,
  type FilmUploadFinalizePayload,
  type FilmUploadSlot,
} from "@/types/api/films";

export const filmsApi = {
  list: (params: FilmListParams, accessToken?: string) =>
    apiRequest<FilmListResponse>("/admin/movies", {
      params,
      accessToken,
    }),

  detail: (id: string, accessToken?: string) =>
    apiRequest<FilmDetail>(`/admin/movies/${id}`, { accessToken }),

  create: (payload: FilmMetadataPayload, accessToken?: string) =>
    apiRequest<FilmCreateOrUpdateResponse>("/admin/movies", {
      method: "POST",
      body: payload,
      accessToken,
    }),

  update: (id: string, payload: FilmMetadataPayload, accessToken?: string) =>
    apiRequest<FilmCreateOrUpdateResponse>(`/admin/movies/${id}`, {
      method: "PUT",
      body: payload,
      accessToken,
    }),

  performAction: (id: string, payload: FilmActionPayload, accessToken?: string) =>
    apiRequest<FilmActionResponse>(`/admin/movies/${id}/actions`, {
      method: "POST",
      body: payload,
      accessToken,
    }),

  presignUploads: (id: string, files: FilmUploadFileDescriptor[], accessToken?: string) =>
    apiRequest<FilmUploadSlot[]>(`/admin/movies/${id}/uploads/presign`, {
      method: "POST",
      body: { files },
      accessToken,
    }),

  finalizeUploads: (id: string, payload: FilmUploadFinalizePayload, accessToken?: string) =>
    apiRequest<{ ok: boolean }>(`/admin/movies/${id}/uploads/finalize`, {
      method: "POST",
      body: payload,
      accessToken,
    }),

  metaOptions: (accessToken?: string) =>
    apiRequest<FilmMetaOptions>("/admin/movies/meta/options", { accessToken }),
};

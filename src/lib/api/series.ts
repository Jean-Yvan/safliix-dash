import { apiRequest } from "./client";
import {
  type CreateSeasonPayload,
  type EpisodeDetail,
  type EpisodeFinalizePayload,
  type EpisodeListParams,
  type EpisodeMetadataPayload,
  type EpisodeUploadDescriptor,
  type EpisodeUploadSlot,
  type SeasonFinalizePayload,
  type SeasonUploadDescriptor,
  type SeasonUploadSlot,
  type SeriesCreateOrUpdateResponse,
  type SeriesDetail,
  type SeriesListParams,
  type SeriesListResponse,
  type SeriesMetaOptionsResponse,
  type SeriesMetadataPayload,
  type SeriesUploadDescriptor,
  type SeriesUploadSlot,
} from "@/types/api/series";

export const seriesApi = {
  list: (params: SeriesListParams, accessToken?: string) =>
    apiRequest<SeriesListResponse>("/series", { params, accessToken }),

  detail: (id: string, accessToken?: string) => apiRequest<SeriesDetail>(`/series/${id}`, { accessToken }),

  create: (payload: SeriesMetadataPayload, accessToken?: string) =>
    apiRequest<SeriesCreateOrUpdateResponse>("/series", { method: "POST", body: payload, accessToken }),

  update: (id: string, payload: SeriesMetadataPayload, accessToken?: string) =>
    apiRequest<SeriesCreateOrUpdateResponse>(`/series/${id}`, { method: "PUT", body: payload, accessToken }),

  presignUploads: (id: string, files: SeriesUploadDescriptor[], accessToken?: string) =>
    apiRequest<SeriesUploadSlot[]>(`/series/${id}/uploads/presign`, {
      method: "POST",
      body: { files },
      accessToken,
    }),

  finalizeUploads: (id: string, uploads: SeriesUploadSlot[], accessToken?: string) =>
    apiRequest<{ ok: boolean }>(`/series/${id}/uploads/finalize`, {
      method: "POST",
      body: { uploads: uploads.map((u) => ({ key: u.key, finalUrl: u.finalUrl })) },
      accessToken,
    }),

  metaOptions: (accessToken?: string) => apiRequest<SeriesMetaOptionsResponse>("/series/meta/options", { accessToken }),

  // Seasons
  createSeason: (seriesId: string, payload: CreateSeasonPayload, accessToken?: string) =>
    apiRequest<{ seasonId: string }>(`/series/${seriesId}/seasons`, { method: "POST", body: payload, accessToken }),

  presignSeasonUploads: (seriesId: string, seasonId: string, files: SeasonUploadDescriptor[], accessToken?: string) =>
    apiRequest<SeasonUploadSlot[]>(`/series/${seriesId}/seasons/${seasonId}/uploads/presign`, {
      method: "POST",
      body: { files },
      accessToken,
    }),

  finalizeSeasonUploads: (seriesId: string, seasonId: string, uploads: SeasonUploadSlot[], accessToken?: string) =>
    apiRequest<{ ok: boolean }>(`/series/${seriesId}/seasons/${seasonId}/uploads/finalize`, {
      method: "POST",
      body: { uploads: uploads.map((u) => ({ key: u.key, finalUrl: u.finalUrl })) },
      accessToken,
    }),

  // Episodes
  listEpisodes: (seriesId: string, seasonId: string, params?: EpisodeListParams, accessToken?: string) =>
    apiRequest<EpisodeDetail[]>(`/series/${seriesId}/seasons/${seasonId}/episodes`, { params, accessToken }),

  getEpisode: (episodeId: string, accessToken?: string) => apiRequest<EpisodeDetail>(`/episodes/${episodeId}`, { accessToken }),

  createEpisode: (seriesId: string, seasonId: string, payload: EpisodeMetadataPayload, accessToken?: string) =>
    apiRequest<{ id: string }>(`/series/${seriesId}/seasons/${seasonId}/episodes`, {
      method: "POST",
      body: payload,
      accessToken,
    }),

  presignEpisodeUploads: (episodeId: string, files: EpisodeUploadDescriptor[], accessToken?: string) =>
    apiRequest<EpisodeUploadSlot[]>(`/episodes/${episodeId}/uploads/presign`, {
      method: "POST",
      body: { files },
      accessToken,
    }),

  finalizeEpisodeUploads: (episodeId: string, uploads: EpisodeUploadSlot[], accessToken?: string) =>
    apiRequest<{ ok: boolean }>(`/episodes/${episodeId}/uploads/finalize`, {
      method: "POST",
      body: { uploads: uploads.map((u) => ({ key: u.key, finalUrl: u.finalUrl })) },
      accessToken,
    }),
};

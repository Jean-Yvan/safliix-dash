import { apiRequest } from "./client";
import {
  type CreateRightsHolderPayload,
  type ImageRightsHolder,
  type ImageRightsHolderDetail,
  type ImageRightsFormStateUpdate,
  type RightsHolderContentsGroup,
  type RightsHolderListParams,
  type RightsHolderContentType,
  type RightsHolderContentsListResponse,
  type RightsHolderListResponse,
} from "@/types/api/imageRights";

/**
 * API pour gérer les ayants droit
 */
export const imageRightsApi = {
  /** Liste des ayants droit */
  list: (params: RightsHolderListParams, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<RightsHolderListResponse>("/rights-holders", { params, accessToken, signal }),

  /** Détail d’un ayant droit */
  detail: (id: string, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<ImageRightsHolderDetail>(`/rights-holders/${id}`, { accessToken, signal }),

  getById: (id:string, accessToken?:string, signal?:AbortSignal) => 
    apiRequest<ImageRightsHolder>(`/rights-holders/${id}`, {accessToken, signal}),

  /** Création */
  create: (payload: CreateRightsHolderPayload, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<ImageRightsHolderDetail>("/rights-holders", {
      method: "POST",
      body: payload,
      accessToken,
      signal,
    }),
  
  update: (id:string,payload: ImageRightsFormStateUpdate, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<ImageRightsHolderDetail>(`/rights-holders/${id}`, {
      method: "PUT",
      body: payload,
      accessToken,
      signal,
    }),
  
  delete: (id:string, accessToken?:string, signal?:AbortSignal) => apiRequest<void>(`/rights-holders/${id}`,{
      method: "DELETE",
      accessToken,
      signal,
    }),  
  
  /** Récupérer les contenus d’un ayant droit */
  contents: (id: string, type: RightsHolderContentType, accessToken?: string, signal?: AbortSignal) =>
    apiRequest<RightsHolderContentsGroup[]>(`/api/rights-holders/${id}/contents`, {
      params: { type },
      accessToken,
      signal,
    }),

  /** Liste globale de contenus filtrés par type et période */
  contentsList: (
    type: RightsHolderContentType,
    accessTokenOrOptions?: string | { accessToken?: string; signal?: AbortSignal; from?: string; to?: string },
    signal?: AbortSignal,
  ) => {
    const options =
      typeof accessTokenOrOptions === "string"
        ? { accessToken: accessTokenOrOptions, signal }
        : accessTokenOrOptions || {};
    const { accessToken, from, to, signal: finalSignal } = options;

    return apiRequest<RightsHolderContentsListResponse>(
      "/rights-holders/contents",
      { params: { type, from, to }, accessToken, signal: finalSignal },
    );
  },

  
};

/**
 * Normalisation des données côté frontend
 * Ici on fait simplement un cast vers le type attendu
 * Aucun regroupement manuel nécessaire si le backend renvoie déjà des groups
 */
export function normalizeRightsHolderGroups(
  res: RightsHolderContentsListResponse | RightsHolderContentsGroup[],
): RightsHolderContentsGroup[] {
  if (!res) return [];

  // Si la réponse est enveloppée dans "data", on unwrap
  if (typeof res === "object" && "data" in res) {
    return Array.isArray(res.data) ? res.data : [];
  }

  // Sinon on retourne le tableau tel quel
  return Array.isArray(res) ? res : [];
}

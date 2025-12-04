import { type PaginatedResponse, type PageInfo } from "./common";

export type FilmStatus = "publish" | "pause" | "draft" | "archived" | string;

export interface FilmListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: FilmStatus;
  category?: string;
  sort?: string;
}

export interface FilmStats {
  vues?: number;
  revenus?: number;
  locations?: number;
  abonnements?: number;
  [key: string]: number | undefined;
}

export interface FilmGeoPoint {
  name: string;
  value: number;
}

export interface FilmListItem {
  id: string;
  title: string;
  status: FilmStatus;
  director: string;
  dp: string;
  category: string;
  poster: string;
  hero: string;
  stats?: FilmStats;
  geo?: FilmGeoPoint[];
  stars?: number;
  donut?: { label?: string; value: number; color?: string };
}

export type FilmListResponse = PaginatedResponse<FilmListItem>;

export interface FilmDetail {
  id: string;
  title: string;
  status: FilmStatus;
  category: string;
  director: string;
  dp: string;
  description?: string;
  language?: string;
  productionHouse?: string;
  country?: string;
  type?: string;
  format?: string;
  genre?: string;
  actors?: string;
  secondType?: string;
  duration: string;
  releaseDate: string;
  publishDate: string;
  price: number;
  poster: string;
  hero: string;
  synopsis: string;
  stats?: FilmStats;
  activity?: unknown[];
  geo?: FilmGeoPoint[];
}

export interface FilmActionPayload {
  action: "publish" | "pause";
}

export interface FilmActionResponse {
  status: FilmStatus;
}

export type FilmUploadKey = "main_image" | "secondary_image" | "trailer" | "movie";

export interface FilmUploadFileDescriptor {
  key: FilmUploadKey;
  name: string;
  type: string;
}

export interface FilmUploadSlot {
  key: FilmUploadKey;
  uploadUrl: string;
  finalUrl: string;
}

export interface FilmUploadFinalizePayload {
  uploads: Array<Pick<FilmUploadSlot, "key" | "finalUrl">>;
}

export interface FilmMetaOptions {
  types: string[];
  categories: string[];
  formats: string[];
  languages: string[];
  genres: string[];
  actors: string[];
  countries: string[];
  productionHouses: string[];
  [key: string]: string[];
}

export interface FilmMetaOptionsResponse {
  options: FilmMetaOptions;
}

export interface FilmMetadataPayload {
  title: string;
  description: string;
  status: FilmStatus;
  language: string;
  productionHouse: string;
  country: string;
  type: string;
  price: number | null;
  releaseDate: string;
  publishDate: string;
  format: string;
  category: string;
  genre: string;
  actors: string;
  director: string;
  duration: string;
  secondType: string;
}

export interface FilmCreateOrUpdateResponse {
  id: string;
}

export interface FilmPageInfo extends PageInfo {}

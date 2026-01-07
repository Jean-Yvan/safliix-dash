import { type TimeRangeParams } from "./common";

export interface AdsGeoBreakdown {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export interface AdsItem {
  id: string;
  title?: string;
  clientName?: string;
  creativeTitle?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  number?: string | number;
  poster?: string;
  banner?: string;
  image?: string;
  cover?: string;
  createdAt?: string;
  score?: number;
  stats?: {
    views?: number | string;
    interactions?: number | string;
    clicks?: number | string;
    conversions?: number | string;
    vues?: number | string;
  };
  geo?: AdsGeoBreakdown[];
}

export interface AdsListParams extends TimeRangeParams {
  page?: number;
  pageSize?: number;
  status?: string;
  sort?: string;
  search?: string;
}

export interface AdsListResponse {
  items: AdsItem[];
  pageInfo?: { page: number; pageSize: number; total: number };
}

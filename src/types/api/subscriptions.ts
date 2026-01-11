import { type PaginatedResponse } from "./common";

export type PlanForm = {
  name: string;
  monthlyPrice: number;
  yearlyDiscount: number; // %
  currency: "XOF" | "EUR" | "USD";
  devices: number;
  quality: string;
  description: string;
};

export interface SubscriptionListParams {
  page: number;
  pageSize: number;
  filter?: string;
}

export interface SubscriptionItem {
  id: string;
  userId: string;
  planId: string;
  paymentMethod: string;
  startDate?: string;
  status?: string;
  total?: number;
  currency?: string;
  userName?: string;
  country?: string;
}

export type SubscriptionListResponse = PaginatedResponse<SubscriptionItem>;

export interface PlanListParams {
  page: number;
  pageSize: number;
}

export interface PlanItem {
  id: string;
  name: string;
  price: number;
  period: string;
  features?: string[];
  status?: string;
  devices?: number;
  quality?: string;
  currency?: string;
  description?:string;
  yearlyDiscount: number;
}

export type PlanListResponse = PaginatedResponse<PlanItem>;

export interface PlanDetail extends PlanItem {}

export interface PlanPayload {
  id:string;
  name: string;
  price: number;
  yearlyDiscount: number;
  status: string;
  devices?: number;
  quality?: string;
  currency?: string;
}

export interface CreateSubscriptionPayload {
  userId: string;
  planId: string;
  paymentMethod: string;
  startDate?: string;
  promoCode?: string;
}

export interface CreateSubscriptionResponse { subscriptionId: string }

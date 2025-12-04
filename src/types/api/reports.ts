export interface ReportItem {
  id: string;
  name: string;
  createdAt?: string;
  status?: string;
}

export interface ReportListResponse {
  items: ReportItem[];
}

export interface IntroResource {
  id: string;
  title: string;
  url: string;
  type?: string;
}

export interface IntroResourcesResponse {
  items: IntroResource[];
}

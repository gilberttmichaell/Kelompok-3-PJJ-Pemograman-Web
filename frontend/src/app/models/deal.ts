// models/Deal.ts

export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  closed_at?: string;
  created_at?: string;

  // dari JOIN leads
  lead_id?: number;
  lead_title?: string;
  lead_status?: string;

  // dari JOIN customers
  customer_id?: number;
  customer_name?: string;
  customer_company?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  total?: number;
  data: T;
}
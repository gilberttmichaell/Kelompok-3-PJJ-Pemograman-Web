export interface ActivityModel {
  id?: number;
  customer_id?: number;
  customer_name?: string;
  type: string;
  description: string;
  activity_date: string;
  created_by?: number;
}

export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
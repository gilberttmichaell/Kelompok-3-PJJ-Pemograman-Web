export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  created_by?: number;
  created_at?: string;
}

export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
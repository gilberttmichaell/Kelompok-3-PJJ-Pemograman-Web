export interface ContactModel {
  id?: number;
  customer_id: number;
  customer_name?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
}

export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  created_at?: string;
}
export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
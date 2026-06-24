//penerjemah dari database yang dimiliki
export interface Deal {
  id: number;
  title: string;
  value: number;
  stage: string;
  closed_at: string | null;
  created_at: string;

  lead_id: number;
  lead_title: string;

  customer_id: number;
  customer_name: string;
}
//response dari backend {success, total, data}
export interface ApiResponse<T>{
    success: boolean;
    message: string;
    total?: number;
    data: T;
}
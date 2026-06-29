// models/Customer.ts

// Enum status - lebih aman dari string biasa
export enum CustomerStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

// Interface sebagai kontrak bentuk data
export interface Customer {
    id: number;
    name: string;
    email: string;
    company: string;
    status: CustomerStatus;
}
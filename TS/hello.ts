// hello.ts

let pesan: string = "Halo, selamat datang di TypeScript!";

// 1. Interface untuk Tabel Customers
interface Customer {
    readonly id: number;      // ID tidak bisa diubah
    name: string;
    email?: string;           // Opsional (mungkin belum ada email)
    company_name?: string;
}

// 2. Interface untuk Tabel Leads
interface Lead {
    readonly id: number;
    customer_id: number;
    Leadstatus: 'new' | 'contacted' | 'qualified'; // Union type (pilihan terbatas)
    value: number;
}

// 3. Interface untuk Tabel Deals
interface Deal {
    readonly id: number;
    lead_id: number;
    amount: number;
    closed_at?: Date; // Bisa kosong jika belum closing
}

console.log(pesan);
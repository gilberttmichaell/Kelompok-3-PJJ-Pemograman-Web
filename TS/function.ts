// Fungsi dengan tipe parameter dan return type
function tambah(a: number, b: number): number {
    return a + b;
}

// Fungsi dengan parameter opsional (email?)
// Jika tidak diisi, email bernilai 'undefined'
function kirimNotifikasi(
    user: string,
    email?: string
): void {
    console.log(
        "Mengirim ke " +
        user +
        (email ? " via " + email : "")
    );
}

// Fungsi dengan default parameter (status = 'New')
function buatLead(
    nama: string,
    status: string = "New"
): object {
    return { nama, status };
}

// Penggunaan
console.log(tambah(5, 10)); // 15

kirimNotifikasi("Budi"); // Mengirim ke Budi

console.log(
    buatLead("Perusahaan A")
); // { nama: 'Perusahaan A', status: 'New' }
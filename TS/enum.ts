// Definisi Enum
enum LeadStatus{
    New = 'New',
    Contacted = 'Contacted',
    Qualified = 'Qualified',
    Lost = 'Lost'
}

enum DealStage{
    Proposal = 'Proposal',
    Negotiation = 'Negotiation',
    Won = 'Won',
    Lost = 'Lost'
}

// Penggunaan pada Interface
interface Lead {
    readonly id: number;
    status: LeadStatus; // Mengunci nilai hanya boleh dari enum di atas
}

// Contoh Penggunaan dalam Fungsi
function updateLeadStatus(
    lead: Lead,
    newStatus: LeadStatus
): void {
    lead.status = newStatus;
    console.log(`Status diubah menjadi: ${lead.status}`);
}

// Cara Memanggilnya
const myLead: Lead = {
    id: 1,
    status: LeadStatus.New
};

updateLeadStatus(myLead, LeadStatus.Qualified); // Aman & Terstandarisasi
"use strict";
// Definisi Enum
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["New"] = "New";
    LeadStatus["Contacted"] = "Contacted";
    LeadStatus["Qualified"] = "Qualified";
    LeadStatus["Lost"] = "Lost";
})(LeadStatus || (LeadStatus = {}));
var DealStage;
(function (DealStage) {
    DealStage["Proposal"] = "Proposal";
    DealStage["Negotiation"] = "Negotiation";
    DealStage["Won"] = "Won";
    DealStage["Lost"] = "Lost";
})(DealStage || (DealStage = {}));
// Contoh Penggunaan dalam Fungsi
function updateLeadStatus(lead, newStatus) {
    lead.status = newStatus;
    console.log(`Status diubah menjadi: ${lead.status}`);
}
// Cara Memanggilnya
const myLead = {
    id: 1,
    status: LeadStatus.New
};
updateLeadStatus(myLead, LeadStatus.Qualified); // Aman & Terstandarisasi

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads.html'
})
export class Leads implements OnInit {

  leads: Lead[] = [];

  constructor(
    private leadService: LeadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    this.leadService.getAll().subscribe({
      next: (res) => {
        this.leads = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
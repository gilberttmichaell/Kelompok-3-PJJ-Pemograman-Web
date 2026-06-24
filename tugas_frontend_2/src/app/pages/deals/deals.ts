import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealService } from '../../services/deal.service';
import { Deal } from '../../models/deal';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deals.html'
})
export class Deals implements OnInit {

  deals: Deal[] = [];

  constructor(
    private dealService: DealService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDeals();
  }

  loadDeals(): void {
    this.dealService.getAll().subscribe({
      next: (res) => {
        this.deals = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
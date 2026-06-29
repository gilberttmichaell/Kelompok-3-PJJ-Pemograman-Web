import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  stats: any = null;
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef, // tambah
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    } else {
      this.isLoading = false;
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.stats = res?.data ?? res ?? null;
        this.isLoading = false;
        this.cdr.detectChanges(); // paksa re-render
      },

      error: (err) => {
        this.errorMsg =
          err?.error?.message || 'Gagal memuat data dashboard.';
        this.isLoading = false;
        this.cdr.detectChanges(); // paksa re-render
        console.error(err);
      }
    });
  }
}
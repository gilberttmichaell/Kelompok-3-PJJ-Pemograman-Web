import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DealService } from '../../services/deal.service';
import { Deal } from '../../models/deal';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deals.html',
  styleUrl: './deals.css'
})
export class Deals implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('datatablesSimple') tableRef!: ElementRef<HTMLTableElement>;
  private dataTable: any = null;

  view: 'list' | 'create' | 'edit' = 'list';

  deals: Deal[] = [];
  leads: Lead[] = [];
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  successMsg = '';
  selectedDealId: number | null = null;
  isAdmin = false;
  selectedStage = 'Semua';
  readonly pipelineStages = ['Open', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  readonly stageFilters = ['Semua', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private dealService: DealService,
    private leadService: LeadService,
    private authService: AuthService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.createForm = this.fb.group({
      lead_id: [null, Validators.required],
      title: ['', Validators.required],
      value: [0, Validators.required],
      stage: ['Open', Validators.required],
      closed_at: [null]
    });

    this.editForm = this.fb.group({
      lead_id: [null, Validators.required],
      title: ['', Validators.required],
      value: [0, Validators.required],
      stage: ['Open', Validators.required],
      closed_at: [null]
    });
  }

  ngOnInit(): void {
    this.loadDeals();
    this.loadLeads();
  }

  async ngAfterViewInit(): Promise<void> {}

  ngOnDestroy(): void {
    if (this.dataTable) {
      try { this.dataTable.destroy(); } catch {}
    }
  }

  async initializeDataTable(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.tableRef?.nativeElement) return;

    if (this.dataTable) {
      try { this.dataTable.destroy(); } catch {}
      this.dataTable = null;
    }

    const { DataTable } = await import('simple-datatables');
    this.dataTable = new DataTable(this.tableRef.nativeElement, {
      searchable: true,
      sortable: true,
      perPage: 10,
      perPageSelect: [5, 10, 25, 50]
    });

    this.attachActionListener();
  }

  get filteredDeals(): Deal[] {
    if (this.selectedStage === 'Semua') return this.deals;
    return this.deals.filter((deal) => (deal.stage || 'Open') === this.selectedStage);
  }

  get visiblePipelineStages(): string[] {
    if (this.selectedStage === 'Semua') return ['Proposal', 'Negotiation', 'Won', 'Lost'];
    return [this.selectedStage];
  }

  setStageFilter(stage: string): void {
    this.selectedStage = stage;
    if (this.dataTable) {
      try { this.dataTable.destroy(); } catch {}
      this.dataTable = null;
    }
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId) && this.view === 'list') {
      setTimeout(() => { this.initializeDataTable(); }, 50);
    }
  }

  stageFilterClass(stage: string): string {
    return this.selectedStage === stage ? 'stage-filter-active' : '';
  }

  private attachActionListener(): void {
    const table = this.tableRef.nativeElement;
    if ((table as any).__listenerAdded) return;
    (table as any).__listenerAdded = true;

    table.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('button[data-action]') as HTMLElement;
      if (!button) return;

      const action = button.getAttribute('data-action');
      const id = Number(button.getAttribute('data-id'));

      this.ngZone.run(() => {
        if (action === 'edit') this.showEdit(id);
        if (action === 'delete') this.deleteDeal(id);
      });
    });
  }

  loadDeals(): void {
    this.isLoading = true;
    this.dealService.getAll().subscribe({
      next: (res) => {
        this.deals = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId) && this.view === 'list') {
          setTimeout(() => { this.initializeDataTable(); }, 50);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Gagal memuat data deal';
        console.error(err);
      }
    });
  }

  loadLeads(): void {
    this.leadService.getAll().subscribe({
      next: (res) => { this.leads = res.data; },
      error: (err) => { console.error(err); }
    });
  }

  dealsByStage(stage: string): Deal[] {
    return this.deals.filter(deal => (deal.stage || 'Open') === stage);
  }

  stageTotal(stage: string): number {
    return this.dealsByStage(stage).reduce((total, deal) => total + Number(deal.value || 0), 0);
  }

  showCreate(): void {
    this.createForm.reset({ stage: 'Open', value: 0, closed_at: null });
    this.view = 'create';
  }

  showEdit(id: number): void {
    const deal = this.deals.find(d => d.id === id);
    if (!deal) return;
    this.selectedDealId = id;
    this.editForm.patchValue({
      ...deal,
      closed_at: deal.closed_at ? deal.closed_at.substring(0, 10) : null
    });
    this.view = 'edit';
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    this.dealService.create(this.createForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadDeals();
            this.loadLeads();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Deal gagal ditambahkan.' });
      }
    });
  }

  submitUpdate(): void {
    if (!this.selectedDealId) return;
    if (this.editForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    this.dealService.update(this.selectedDealId, this.editForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadDeals();
            this.loadLeads();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Deal gagal diperbarui.' });
      }
    });
  }

  deleteDeal(id: number): void {
    Swal.fire({
      title: 'Hapus Deal?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.dealService.delete(id).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success', title: 'Berhasil', text: res.message,
            timer: 1500, showConfirmButton: false
          }).then(() => {
            this.loadDeals();
            this.loadLeads();
            this.backToList();
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Deal gagal dihapus.' });
        }
      });
    });
  }

  backToList(): void {
    this.view = 'list';
    this.selectedDealId = null;
    this.createForm.reset({ stage: 'Open', value: 0, closed_at: null });
    this.editForm.reset({ stage: 'Open', value: 0, closed_at: null });
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => { this.initializeDataTable(); }, 50);
    }
  }
}

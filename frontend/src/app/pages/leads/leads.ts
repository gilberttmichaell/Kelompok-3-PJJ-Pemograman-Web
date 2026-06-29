import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leads.html',
  styleUrl: './leads.css'
})
export class Leads implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('datatablesSimple') tableRef!: ElementRef<HTMLTableElement>;
  private dataTable: any = null;

  view: 'list' | 'create' | 'edit' = 'list';

  leads: Lead[] = [];
  customers: Customer[] = [];
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  successMsg = '';
  selectedLeadId: number | null = null;
  isAdmin = false;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private leadService: LeadService,
    private customerService: CustomerService,
    private authService: AuthService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.createForm = this.fb.group({
      customer_id: [null, Validators.required],
      title: ['', Validators.required],
      source: ['', Validators.required],
      notes: [''],
      status: ['New', Validators.required],
      assigned_to: [Number(this.authService.getUserId()), Validators.required]
    });

    this.editForm = this.fb.group({
      customer_id: [null, Validators.required],
      title: ['', Validators.required],
      source: ['', Validators.required],
      notes: [''],
      status: ['New', Validators.required],
      assigned_to: [Number(this.authService.getUserId()), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLeads();
    this.loadCustomers();
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
        if (action === 'delete') this.deleteLead(id);
      });
    });
  }

  loadLeads(): void {
    this.isLoading = true;
    this.leadService.getAll().subscribe({
      next: (res) => {
        this.leads = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId) && this.view === 'list') {
          setTimeout(() => { this.initializeDataTable(); }, 50);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Gagal memuat data lead';
        console.error(err);
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (res) => { this.customers = res.data; },
      error: (err) => { console.error(err); }
    });
  }

  showCreate(): void {
    this.createForm.reset({ status: 'New', assigned_to: Number(this.authService.getUserId()) });
    this.view = 'create';
  }

  showEdit(id: number): void {
    const lead = this.leads.find(l => l.id === id);
    if (!lead) return;
    this.selectedLeadId = id;
    this.editForm.patchValue(lead);
    this.view = 'edit';
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    this.leadService.create(this.createForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadLeads();
            this.loadCustomers();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Lead gagal ditambahkan.' });
      }
    });
  }

  submitUpdate(): void {
    if (!this.selectedLeadId) return;
    if (this.editForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    this.leadService.update(this.selectedLeadId, this.editForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadLeads();
            this.loadCustomers();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Lead gagal diperbarui.' });
      }
    });
  }

  deleteLead(id: number): void {
    Swal.fire({
      title: 'Hapus Lead?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.leadService.delete(id).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success', title: 'Berhasil', text: res.message,
            timer: 1500, showConfirmButton: false
          }).then(() => {
            this.loadLeads();
            this.loadCustomers();
            this.backToList();
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Lead gagal dihapus.' });
        }
      });
    });
  }

  backToList(): void {
    this.view = 'list';
    this.selectedLeadId = null;
    this.createForm.reset({ status: 'New', assigned_to: Number(this.authService.getUserId()) });
    this.editForm.reset({ status: 'New', assigned_to: Number(this.authService.getUserId()) });
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => { this.initializeDataTable(); }, 50);
    }
  }
}

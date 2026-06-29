import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivityService } from '../../services/activity.service';
import { CustomerService } from '../../services/customer.service';
import { ActivityModel } from '../../models/activity';
import { Customer } from '../../models/customer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activities.html',
  styleUrl: './activities.css'
})
export class Activity implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('datatablesSimple') tableRef!: ElementRef<HTMLTableElement>;
  private dataTable: any = null;

  view: 'list' | 'create' | 'edit' = 'list';

  activities: ActivityModel[] = [];
  customers: Customer[] = [];
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  successMsg = '';
  selectedActivityId: number | null = null;
  isAdmin = false;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private activityService: ActivityService,
    private customerService: CustomerService,
    private authService: AuthService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.createForm = this.fb.group({
      type: ['', Validators.required],
      customer_id: [null, Validators.required],
      activity_date: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      type: ['', Validators.required],
      customer_id: [null, Validators.required],
      activity_date: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadActivities();
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
        if (action === 'delete') this.deleteActivity(id);
      });
    });
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getAll().subscribe({
      next: (res) => {
        this.activities = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId) && this.view === 'list') {
          setTimeout(() => { this.initializeDataTable(); }, 50);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Gagal memuat data activity';
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
    this.createForm.reset({
      type: '',
      customer_id: null,
      activity_date: '',
      description: ''
    });
    this.view = 'create';
  }

  showEdit(id: number): void {
    const activity = this.activities.find(a => a.id === id);
    if (!activity) return;
    this.selectedActivityId = id;
    this.editForm.patchValue({
      ...activity,
      activity_date: activity.activity_date
        ? activity.activity_date.substring(0, 10)
        : ''
    });
    this.view = 'edit';
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    const payload = this.createForm.value;

    this.activityService.create(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadActivities();
            this.loadCustomers();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menambah data.' });
      }
    });
  }

  submitUpdate(): void {
    if (!this.selectedActivityId) return;
    if (this.editForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    this.activityService.update(this.selectedActivityId, this.editForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadActivities();
            this.loadCustomers();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal memperbarui data.' });
      }
    });
  }

  deleteActivity(id: number): void {
    Swal.fire({
      title: 'Hapus Activity?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.activityService.delete(id).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success', title: 'Berhasil', text: res.message,
            timer: 1500, showConfirmButton: false
          }).then(() => {
            this.loadActivities();
            this.loadCustomers();
            this.backToList();
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Activity gagal dihapus.' });
        }
      });
    });
  }

  backToList(): void {
    this.view = 'list';
    this.selectedActivityId = null;
    this.createForm.reset();
    this.editForm.reset();
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => { this.initializeDataTable(); }, 50);
    }
  }
}

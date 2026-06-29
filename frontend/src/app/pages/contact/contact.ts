import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactModel } from '../../models/contact';
import { ContactService } from '../../services/contact.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('datatablesSimple') tableRef!: ElementRef<HTMLTableElement>;
  private dataTable: any = null;

  view: 'list' | 'create' | 'edit' = 'list';

  contact: ContactModel[] = [];
  customers: Customer[] = []; 
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  successMsg = '';
  selectedContactId: number | null = null;
  isAdmin = false;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private contactService: ContactService,
    private customerService: CustomerService, 
    private authService: AuthService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      customer_id: [null, Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      customer_id: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContact();
    this.loadCustomers(); 
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (res) => {
        this.customers = res.data; 
      },
      error: (err) => {
        console.error('Gagal memuat data customer untuk dropdown', err);
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {}

  ngOnDestroy(): void {
    if (this.dataTable) {
      try {
        this.dataTable.destroy();
      } catch {}
    }
  }

  async initializeDataTable(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.tableRef?.nativeElement) return;

    if (this.dataTable) {
      try {
        this.dataTable.destroy();
      } catch {}
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
        if (action === 'edit') {
          this.showEdit(id);
        }
        if (action === 'delete') {
          this.deleteContact(id);
        }
      });
    });
  }

  loadContact(): void {
    this.isLoading = true;
    this.contactService.getAll().subscribe({
      next: (res) => {
        this.contact = res.data;
        this.isLoading = false;
                this.cdr.detectChanges();
                if (isPlatformBrowser(this.platformId) && this.view === 'list') {
          setTimeout(() => {
            this.initializeDataTable();
          }, 50);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Gagal memuat data contact';
        console.error(err);
      }
    });
  }

  showCreate(): void {
    this.createForm.reset();
    this.view = 'create';
  }

  showEdit(id: number): void {
    const contact = this.contact.find(c => c.id === id);
    if (!contact) return;

    this.selectedContactId = id;
    this.editForm.patchValue(contact);
    this.view = 'edit';
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Silakan lengkapi data terlebih dahulu.'
      });
      return;
    }

    this.isSaving = true;
    this.contactService.create(this.createForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: res.message,
          confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadContact();
            this.loadCustomers();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Contact gagal ditambahkan.'
        });
      }
    });
  }

  submitUpdate(): void {
    if (!this.selectedContactId) return;
    if (this.editForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Silakan lengkapi data.'
      });
      return;
    }

    this.isSaving = true;
    this.contactService.update(this.selectedContactId, this.editForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: res.message,
          confirmButtonColor: '#4e73df'
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.loadContact();
            this.loadCustomers();
            this.backToList();
          }
        });
      },
      error: (err) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Contact gagal diperbarui.'
        });
      }
    });
  }

  deleteContact(id: number): void {
    Swal.fire({
      title: 'Hapus Contact?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.contactService.delete(id).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: res.message,
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.loadContact();
            this.loadCustomers();
            this.backToList();
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Contact gagal dihapus.'
          });
        }
      });
    });
  }

  backToList(): void {
    this.view = 'list';
    this.selectedContactId = null;
    this.createForm.reset();
    this.editForm.reset();

    this.cdr.detectChanges();
    
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeDataTable();
      }, 50);
    }
  }
}

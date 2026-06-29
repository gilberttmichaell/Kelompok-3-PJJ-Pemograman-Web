import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject,  
  PLATFORM_ID, NgZone, ChangeDetectorRef   } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class CustomerComponent
implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('datatablesSimple')
  tableRef!: ElementRef<HTMLTableElement>;

  private dataTable: any = null;

  view: 'list' | 'create' | 'edit' = 'list';

  customers: Customer[] = [];
  isLoading = false;
  isSaving = false;
  errorMsg = '';
  successMsg = '';
  selectedCustomerId: number | null = null;
  isAdmin = false;
  createForm: FormGroup;
  editForm: FormGroup;

  constructor(

    private customerService: CustomerService,
    private authService: AuthService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID)
    private platformId: Object

  ) {
    this.isAdmin = this.authService.isAdmin();

    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      company: [''],
      status: ['Lead']

    });

    this.editForm = this.fb.group({

      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      company: [''],
      status: ['Lead']

    });

  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  async ngAfterViewInit(): Promise<void> {

  }

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

          this.deleteCustomer(id);

        }

      });

    });

  }

  loadCustomers(): void {

    this.isLoading = true;

    this.customerService.getAll().subscribe({

      next: (res) => {

        this.customers = res.data;

        this.isLoading = false;

        this.cdr.detectChanges();

        setTimeout(() => {

          this.initializeDataTable();

        });

      },

      error: (err) => {

        this.isLoading = false;

        this.errorMsg = 'Gagal memuat data customer';

        console.error(err);

      }

    });

  }

  showCreate(): void {

    this.createForm.reset({

      status: 'Lead'

    });

    this.view = 'create';

  }

  showEdit(id: number): void {

    const customer = this.customers.find(c => c.id === id);

    if (!customer) return;

    this.selectedCustomerId = id;

    this.editForm.patchValue(customer);

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

    this.customerService.create(this.createForm.value).subscribe({

      next: (res) => {

        this.isSaving = false;

        Swal.fire({

          icon: 'success',

          title: 'Berhasil',

          text: res.message,

          confirmButtonColor: '#4e73df'

        }).then(() => {

          this.view = 'list';

          this.loadCustomers();

        });

      },

      error: (err) => {

        this.isSaving = false;

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Gagal',

          text: 'Customer gagal ditambahkan.'

        });

      }

    });

  }

  submitUpdate(): void {

    if (!this.selectedCustomerId) return;

    if (this.editForm.invalid) {

      Swal.fire({

        icon: 'warning',

        title: 'Perhatian',

        text: 'Silakan lengkapi data.'

      });

      return;

    }

    this.isSaving = true;

    this.customerService.update(

      this.selectedCustomerId,

      this.editForm.value

    ).subscribe({

      next: (res) => {

        this.isSaving = false;

        Swal.fire({

          icon: 'success',

          title: 'Berhasil',

          text: res.message,

          confirmButtonColor: '#4e73df'

        }).then(() => {

          this.view = 'list';

          this.loadCustomers();

        });

      },

      error: (err) => {

        this.isSaving = false;

        console.error(err);

        Swal.fire({

          icon: 'error',

          title: 'Gagal',

          text: 'Customer gagal diperbarui.'

        });

      }

    });

  }

  deleteCustomer(id: number): void {

    Swal.fire({

      title: 'Hapus Customer?',

      text: 'Data yang dihapus tidak dapat dikembalikan.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#d33',

      cancelButtonColor: '#6c757d',

      confirmButtonText: 'Ya, Hapus',

      cancelButtonText: 'Batal'

    }).then((result) => {

      if (!result.isConfirmed) return;

      this.customerService.delete(id).subscribe({

        next: (res) => {

          Swal.fire({

            icon: 'success',

            title: 'Berhasil',

            text: res.message,

            timer: 1500,

            showConfirmButton: false

          });

          this.loadCustomers();

        },

        error: (err) => {

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Gagal',

            text: 'Customer gagal dihapus.'

          });

        }

      });

    });

  }

  backToList(): void {

    this.view = 'list';

    this.selectedCustomerId = null;

    this.createForm.reset({

      status: 'Lead'

    });

    this.editForm.reset({

      status: 'Lead'

    });

  }

}

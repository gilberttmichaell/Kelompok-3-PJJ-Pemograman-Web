import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit, OnDestroy {

  @ViewChild('datatablesSimple') tableRef!: ElementRef<HTMLTableElement>;
  private dataTable: any = null;

  users: User[] = [];
  view: 'list' | 'create' | 'edit' = 'list';

  isLoading = false;
  isSaving = false;
  errorMsg = '';
  successMsg = '';
  selectedUserId: number | null = null;

  createForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['staff', Validators.required]
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['staff', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      try { this.dataTable.destroy(); } catch {}
      this.dataTable = null;
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
        if (action === 'delete') this.deleteUser(id);
      });
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId) && this.view === 'list') {
          setTimeout(() => { this.initializeDataTable(); }, 50);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = 'Gagal memuat data user';
        console.error(err);
      }
    });
  }

  showCreate(): void {
    this.createForm.reset({ role: 'staff' });
    this.view = 'create';
  }

  showEdit(id: number): void {
    const user = this.users.find(u => u.id === id);
    if (!user) return;
    this.selectedUserId = id;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    this.view = 'edit';
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data terlebih dahulu.' });
      return;
    }

    this.isSaving = true;
    this.userService.create(this.createForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then(() => {
          this.loadUsers();
          this.backToList();
        });
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.error?.message || 'User gagal ditambahkan.' });
      }
    });
  }

  submitUpdate(): void {
    if (!this.selectedUserId) return;
    if (this.editForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Silakan lengkapi data.' });
      return;
    }

    this.isSaving = true;
    const payload = { ...this.editForm.value };
    if (!payload.password) {
      delete payload.password;
    }

    this.userService.update(this.selectedUserId, payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success', title: 'Berhasil', text: res.message, confirmButtonColor: '#4e73df'
        }).then(() => {
          this.loadUsers();
          this.backToList();
        });
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.error?.message || 'User gagal diperbarui.' });
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Hapus User?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.userService.delete(id).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success', title: 'Berhasil', text: res.message,
            timer: 1500, showConfirmButton: false
          }).then(() => {
            this.loadUsers();
          });
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Gagal', text: err.error?.message || 'User gagal dihapus.' });
        }
      });
    });
  }

  backToList(): void {
    this.view = 'list';
    this.selectedUserId = null;
    this.createForm.reset({ role: 'staff' });
    this.editForm.reset({ password: '', role: 'staff' });
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => { this.initializeDataTable(); }, 50);
    }
  }
}
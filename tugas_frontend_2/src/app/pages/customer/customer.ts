import { Component,  OnInit,  Inject,  PLATFORM_ID,  ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class CustomerComponent implements OnInit {

  customers: Customer[] = [];
  isLoading = false;
  errorMsg = '';

  showForm = false;
 
  isEditMode = false;
  editId: number | null = null;

  newCustomer: Customer = {
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Lead'
  };

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.isLoading = true;

    this.customerService.getAll().subscribe({
      next: (res) => {

        this.customers = res.data;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        this.errorMsg = 'Gagal memuat data';
        this.isLoading = false;

        console.error(err);
      }
    });
  }

  createCustomer(): void {

    this.customerService.create(this.newCustomer)
      .subscribe({

        next: (res) => {

          alert(res.message);

          this.newCustomer = {
            name: '',
            email: '',
            phone: '',
            company: '',
            status: 'Lead'
          };

          this.showForm = false;

          this.loadCustomers();
        },

        error: (err) => {
          console.error(err);
        }

      });
  }
  deleteCustomer(id: number): void {

  if (!confirm('Yakin ingin menghapus customer ini?')) {
    return;
  }

  this.customerService.delete(id)
    .subscribe({

      next: () => {
        this.loadCustomers();
      },

      error: (err) => {
        console.error(err);
      }

    });
  }
  editCustomer(customer: Customer): void {

  this.showForm = true;

  this.isEditMode = true;

  this.editId = customer.id!;

  this.newCustomer = {
    ...customer
  };}
  updateCustomer(): void {

  if (!this.editId) return;

  this.customerService
    .update(this.editId, this.newCustomer)
    .subscribe({

      next: (res) => {

        alert(res.message);

        this.isEditMode = false;
        this.editId = null;

        this.newCustomer = {
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'Lead'
        };

        this.showForm = false;

        this.loadCustomers();
      },

      error: (err) => {
        console.error(err);
      }

    });}
    cancelEdit(): void {

  this.showForm = false;

  this.isEditMode = false;

  this.editId = null;

  this.newCustomer = {
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Lead'
  };
}
}
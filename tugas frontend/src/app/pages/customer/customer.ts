import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import { CustomerService } from '../../service/service';
import { Customer } from '../../models/Customer';

declare var $: any;

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  @ViewChild('myTable') myTable!: ElementRef;

  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.customers = this.customerService.getCustomers();

    // Jika getCustomers() mengembalikan Observable:
    // this.customerService.getCustomers().subscribe(data => {
    //   this.customers = data;
    // });
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {

      await import('datatables.net');

      setTimeout(() => {
        if (this.myTable?.nativeElement) {
          $(this.myTable.nativeElement).DataTable();
        }
      });
    }
  }
}
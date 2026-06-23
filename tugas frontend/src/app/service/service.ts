import {Inject, Injectable} from '@angular/core';
import { Customer } from '../models/Customer';
import { Contacts } from '../models/Contacts';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    private customers: Customer[] = [
        {id: 1, name:'Perusahaan A', email: 'perusahaanA@example.com', phone: '021-12345678', company: 'PT Perusahaan A', status: 'Active', create_by: 1, created_at: '2023-01-01'},
        {id: 2, name:'Perusahaan B', email: 'perusahaanB@example.com', phone: '021-87654321', company: 'PT Perusahaan B', status: 'Inactive', create_by: 1, created_at: '2023-01-02'}
    ];

    getCustomers() {
        return this.customers;
    }
}


import {Inject, Injectable} from '@angular/core';
import { Contacts } from '../models/Contacts';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {
    private contacts: Contacts[] = [
        {id: 1, customer_id: 1, name:'John Doe', email: 'john.doe@example.com', phone: '021-12345678', position: 'Manager', created_at: '2023-01-01'},
        {id: 2, customer_id: 1, name:'Jane Smith', email: 'jane.smith@example.com', phone: '021-87654321', position: 'Developer', created_at: '2023-01-02'}
    ];

    getContacts() {
        return this.contacts;
    }
}
import { Component,  ChangeDetectorRef} from '@angular/core';


import { CommonModule } from '@angular/common';
import { ContactModel } from '../../models/contact';
import { ContactService } from '../../services/contact.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {

  contacts: ContactModel[] = [];

showForm = false;


newContact: ContactModel = {
  customer_id: 0,
  name: '',
  email: '',
  phone: '',
  position: ''
};
  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
  this.loadContacts();
}

loadContacts(): void {

  this.contactService.getAll().subscribe({
    next: (res) => {

      this.contacts = res.data;

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error(err);
    }
  });
}
createContact(): void {

  this.contactService.create(this.newContact)
    .subscribe({

      next: (res) => {

        alert(res.message);

        this.newContact = {
          customer_id: 0,
          name: '',
          email: '',
          phone: '',
          position: ''
        };

        this.showForm = false;

        this.loadContacts();
      },

      error: (err) => {
        console.error(err);
      }

    });
}
}
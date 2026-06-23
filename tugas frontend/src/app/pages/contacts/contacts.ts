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

import { ContactsService } from '../../service/contacts';
import { Contacts } from '../../models/Contacts';

declare var $: any;

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css']
})
export class ContactsComponent implements OnInit, AfterViewInit {

  @ViewChild('myTable') myTable!: ElementRef;

  contacts: Contacts[] = [];

  constructor(
    private contactsService: ContactsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.contacts = this.contactsService.getContacts();

    // Jika getContacts() mengembalikan Observable:
    // this.contactsService.getContacts().subscribe(data => {
    //   this.contacts = data;
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
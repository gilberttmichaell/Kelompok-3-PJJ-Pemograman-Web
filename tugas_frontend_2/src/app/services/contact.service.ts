import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { BaseService } from './service';
import { ContactModel } from '../models/contact';
import { ApiResponse } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseService {

  constructor(
    http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<ContactModel[]>> {
    return this.http.get<ApiResponse<ContactModel[]>>(
      `${this.apiUrl}/contacts`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  create(contact: ContactModel): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/contacts`,
      contact,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
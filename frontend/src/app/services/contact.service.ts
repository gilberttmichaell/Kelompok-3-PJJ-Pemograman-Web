// contact.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './service';
import { ContactModel, ApiResponse } from '../models/contact';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends BaseService {
  constructor(
    http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId)
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

  update(id: number, contact: ContactModel): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/contacts/${id}`,
      contact,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/contacts/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
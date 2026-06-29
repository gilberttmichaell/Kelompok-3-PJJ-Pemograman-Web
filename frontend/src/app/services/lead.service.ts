// lead.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './service';
import { Lead, ApiResponse } from '../models/lead';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService extends BaseService {
  constructor(
    http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId)
  }

  getAll(): Observable<ApiResponse<Lead[]>> {
    return this.http.get<ApiResponse<Lead[]>>(
      `${this.apiUrl}/leads`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  create(lead: Lead): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/leads`,
      lead,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, lead: Lead): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/leads/${id}`,
      lead,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/leads/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
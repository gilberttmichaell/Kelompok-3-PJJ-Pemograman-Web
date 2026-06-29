// deal.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './service';
import { Deal, ApiResponse } from '../models/deal';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealService extends BaseService {
  constructor(
    http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId)
  }

  getAll(): Observable<ApiResponse<Deal[]>> {
    return this.http.get<ApiResponse<Deal[]>>(
      `${this.apiUrl}/deals`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  create(deal: Deal): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/deals`,
      deal,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, deal: Deal): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/deals/${id}`,
      deal,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/deals/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
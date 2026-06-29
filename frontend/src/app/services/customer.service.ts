import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './service';
import { Customer } from '../models/customer';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ApiResponse } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService{
  constructor(
    http: HttpClient, @Inject(PLATFORM_ID) platformId:Object
  ) {
    super(http, platformId)
  }
  
//read semua data
getAll(): Observable<ApiResponse<Customer[]>> {
    return this.http.get<ApiResponse<Customer[]>>(
        `${this.apiUrl}/customers`,
        { headers: this.getHeaders() }
    ).pipe(
        catchError(this.handleError)
    );
  }
create(customer: Customer): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(
    `${this.apiUrl}/customers`,
    customer,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
update(id: number, customer: Customer): Observable<ApiResponse<any>> {
  return this.http.put<ApiResponse<any>>(
    `${this.apiUrl}/customers/${id}`,
    customer,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
delete(id: number): Observable<ApiResponse<any>> {
  return this.http.delete<ApiResponse<any>>(
    `${this.apiUrl}/customers/${id}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
getById(id: number): Observable<ApiResponse<Customer>> {
  return this.http.get<ApiResponse<Customer>>(
    `${this.apiUrl}/customers/${id}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
}

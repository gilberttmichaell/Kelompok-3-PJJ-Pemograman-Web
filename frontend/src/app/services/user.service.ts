import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ApiResponse } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService{


  constructor(
    http: HttpClient, @Inject(PLATFORM_ID) platformId:Object
  ) {
    super(http, platformId)
  }
  

//read semua data
getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(
        `${this.apiUrl}/users`,
        { headers: this.getHeaders() }
    ).pipe(
        catchError(this.handleError)
    );
  }
create(user: User): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(
    `${this.apiUrl}/users`,
    user,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
update(id: number, user: User): Observable<ApiResponse<any>> {
  return this.http.put<ApiResponse<any>>(
    `${this.apiUrl}/users/${id}`,
    user,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
delete(id: number): Observable<ApiResponse<any>> {
  return this.http.delete<ApiResponse<any>>(
    `${this.apiUrl}/users/${id}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError)
  );
}
}
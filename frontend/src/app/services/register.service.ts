// register.ts (service) — versi diperbaiki
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { Observable, throwError, catchError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RegisterService {

  protected apiUrl = 'http://localhost:3000';

  constructor(
    protected http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/register`,
      data,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  protected getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-type': 'application/json' });
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  protected handleError(error: any): Observable<never> {
    console.log('API Error:', error);
    return throwError(() => error);
  }
}
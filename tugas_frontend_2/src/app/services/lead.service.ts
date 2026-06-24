import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { BaseService } from './service';
import { Lead } from '../models/lead';
import { ApiResponse } from '../models/lead';

@Injectable({
  providedIn: 'root'
})
export class LeadService extends BaseService {

  constructor(
    http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Lead[]>> {
    return this.http.get<ApiResponse<Lead[]>>(
      `${this.apiUrl}/leads`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
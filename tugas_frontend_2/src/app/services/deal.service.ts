import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { BaseService } from './service';
import { Deal } from '../models/deal';
import { ApiResponse } from '../models/deal';

@Injectable({
  providedIn: 'root'
})
export class DealService extends BaseService {

  constructor(
    http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<Deal[]>> {
    return this.http.get<ApiResponse<Deal[]>>(
      `${this.apiUrl}/deals`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
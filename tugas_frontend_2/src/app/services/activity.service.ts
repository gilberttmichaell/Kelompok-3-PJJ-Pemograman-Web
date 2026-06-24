import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { BaseService } from './service';
import { ActivityModel } from '../models/activity';
import { ApiResponse } from '../models/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {

  constructor(
    http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId);
  }

  getAll(): Observable<ApiResponse<ActivityModel[]>> {
    return this.http.get<ApiResponse<ActivityModel[]>>(
      `${this.apiUrl}/activities`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  create(activity: ActivityModel): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/activities`,
      activity,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
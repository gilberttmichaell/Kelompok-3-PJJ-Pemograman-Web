// activities.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BaseService } from './service';
import { ActivityModel, ApiResponse } from '../models/activity';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseService {
  constructor(
    http: HttpClient, @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(http, platformId)
  }

  getAll(): Observable<ApiResponse<ActivityModel[]>> {
    return this.http.get<ApiResponse<ActivityModel[]>>(
      `${this.apiUrl}/activities`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  create(activities: ActivityModel): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/activities`,
      activities,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, activities: ActivityModel): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/activities/${id}`,
      activities,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/activities/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
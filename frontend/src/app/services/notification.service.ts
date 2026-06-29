import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, catchError, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BaseService } from './service';

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class NotificationService extends BaseService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  private pollingSubscription?: Subscription;

  constructor(http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    super(http, platformId);
  }

  startPolling(intervalMs = 5000): void {
    if (this.pollingSubscription) return;
    this.pollingSubscription = timer(0, intervalMs)
      .pipe(switchMap(() => this.getAll()))
      .subscribe();
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
  }

  refresh(): void {
    this.getAll().subscribe();
  }

  getAll(): Observable<ApiResponse<Notification[]>> {
    return this.http
      .get<ApiResponse<Notification[]>>(`${this.apiUrl}/notifications`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((res) => {
          const data = res?.data ?? [];
          this.notificationsSubject.next(data);
          this.unreadCountSubject.next(data.filter((item) => !item.is_read).length);
        }),
        catchError(this.handleError)
      );
  }

  markAsRead(id: number): Observable<any> {
    const current = this.notificationsSubject.value.map((item) =>
      item.id === id ? { ...item, is_read: true } : item
    );
    this.notificationsSubject.next(current);
    this.unreadCountSubject.next(current.filter((item) => !item.is_read).length);

    return this.http
      .put(`${this.apiUrl}/notifications/${id}/read`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}

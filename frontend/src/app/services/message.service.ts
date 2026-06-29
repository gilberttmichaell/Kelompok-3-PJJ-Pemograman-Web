import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, catchError, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BaseService } from './service';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  sender_name?: string;
  receiver_name?: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class MessageService extends BaseService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

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

  getAll(): Observable<ApiResponse<Message[]>> {
    return this.http
      .get<ApiResponse<Message[]>>(`${this.apiUrl}/messages`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((res) => this.messagesSubject.next(res?.data ?? [])),
        catchError(this.handleError)
      );
  }

  sendMessage(receiver_id: number, message: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/messages`, { receiver_id, message }, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refresh()),
        catchError(this.handleError)
      );
  }

  markAsRead(id: number): Observable<any> {
    const current = this.messagesSubject.value.map((item) =>
      item.id === id ? { ...item, is_read: true } : item
    );
    this.messagesSubject.next(current);

    return this.http
      .put(`${this.apiUrl}/messages/${id}/read`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}

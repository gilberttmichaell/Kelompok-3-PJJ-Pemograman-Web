import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Notification, NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  isLoading = false;
  private subs = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoading = true;
    this.subs.add(
      this.notificationService.notifications$.subscribe((items) => {
        this.notifications = items;
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    );
    this.notificationService.refresh();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  markRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe();
  }

  markAllRead(): void {
    this.notifications
      .filter((item) => !item.is_read)
      .forEach((item) => this.notificationService.markAsRead(item.id).subscribe());
  }
}

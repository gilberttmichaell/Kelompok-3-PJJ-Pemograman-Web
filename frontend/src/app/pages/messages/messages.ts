import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Message, MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit, OnDestroy {
  messages: Message[] = [];
  users: User[] = [];
  isLoading = false;
  isSaving = false;
  messageForm: FormGroup;
  myUserId: number | null = null;
  private subs = new Subscription();

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.myUserId = Number(this.authService.getUserId()) || null;
    this.messageForm = this.fb.group({
      receiver_id: [null, Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoading = true;
    this.subs.add(
      this.messageService.messages$.subscribe((items) => {
        this.messages = items;
        this.isLoading = false;
        this.markIncomingAsRead(items);
        this.cdr.detectChanges();
      })
    );

    this.loadUsers();
    this.messageService.refresh();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = (res.data ?? []).filter((user) => user.id !== this.myUserId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.users = [];
      },
    });
  }

  markIncomingAsRead(items: Message[]): void {
    if (!this.myUserId) return;
    items
      .filter((item) => item.receiver_id === this.myUserId && !item.is_read)
      .forEach((item) => this.messageService.markAsRead(item.id).subscribe());
  }

  replyTo(senderId: number): void {
    this.messageForm.patchValue({ receiver_id: senderId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Pilih penerima dan isi pesan.' });
      return;
    }

    this.isSaving = true;
    const { receiver_id, message } = this.messageForm.value;

    this.messageService.sendMessage(receiver_id, message).subscribe({
      next: () => {
        this.isSaving = false;
        this.messageForm.reset();
        Swal.fire({ icon: 'success', title: 'Terkirim', text: 'Pesan berhasil dikirim' });
      },
      error: () => {
        this.isSaving = false;
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Pesan gagal dikirim' });
      },
    });
  }
}

// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { BaseService } from './service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        if (res?.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('name', res.user.name);
          localStorage.setItem('role', res.user.role);
          localStorage.setItem('userId', res.user.id.toString());
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    }
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp || payload.exp * 1000 <= Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('role');
  }

  getName(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('name');
  }

  getUserId(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('userId');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isStaff(): boolean {
    return this.getRole() === 'staff';
  }
}

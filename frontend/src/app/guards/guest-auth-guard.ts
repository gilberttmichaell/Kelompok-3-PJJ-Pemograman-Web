// src/app/guards/guest.guard.ts

import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const auth = inject(AuthService);

  if (!isPlatformBrowser(platformId)) return true;

  // Sudah login tidak perlu lihat halaman login, lempar ke dashboard
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
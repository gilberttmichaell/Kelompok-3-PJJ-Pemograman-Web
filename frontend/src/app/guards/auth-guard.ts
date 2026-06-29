// src/app/guards/auth-guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const auth = inject(AuthService);

  // saat SSR, biarkan lewat (localStorage tidak ada di server)
  if (!isPlatformBrowser(platformId)) return true;

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
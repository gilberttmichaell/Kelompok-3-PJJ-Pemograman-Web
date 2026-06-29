import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Halaman memakai token localStorage, sehingga harus dirender di browser.
    renderMode: RenderMode.Client
  }
];

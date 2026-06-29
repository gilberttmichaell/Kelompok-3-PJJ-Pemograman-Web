import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  name: string | null = null;
  role: string | null = null;
  initial = 'U';
  constructor(
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.name = this.auth.getName();
      this.role = this.auth.getRole();
      this.initial = (this.name?.charAt(0) || 'U').toUpperCase();
    }
  }
  onLogout(): void{
     Swal.fire({
          title: 'Logout?',
          text: 'Anda akan keluar dari aplikasi',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Ya, Keluar',
          cancelButtonText: 'Batal'
      }).then((result) => { 
      if(!result.isConfirmed) return;
          this.auth.logout();
        Swal.fire({
          title: 'Berhasil!',
          text: 'Berhasil Logout',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          }).then(()=> {
                  this.ngZone.run(()=> this.router.navigate(['/login']));
                });
          });
  }

}

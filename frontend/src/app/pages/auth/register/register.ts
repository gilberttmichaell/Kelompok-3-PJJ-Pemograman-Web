import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  newUser = {
    name: '',
    email: '',
    password: ''
  };

  loading = false;

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  register() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      Swal.fire('Peringatan', 'Semua field wajib diisi!', 'warning');
      return;
    }

    this.loading = true;

    this.registerService.register(this.newUser).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          title: 'Berhasil!',
          text: res.message || 'Register berhasil',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        Swal.fire({
          title: 'Gagal!',
          text: err.error?.message || 'Register gagal',
          icon: 'error'
        });
      }
    });
  }
}

// src/app/pages/login/login.component.ts
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {


        if (isPlatformBrowser(this.platformId) && res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('name', res.user.name);
          localStorage.setItem('role', res.user.role);
          localStorage.setItem('userId', res.user.id.toString());
        }


        Swal.fire({
          title: 'Berhasil!',
          text: 'Login sukses!',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },

      error: (err) => {
        const errorMsg =
          err.error?.message || 'Login Gagal, periksa email/password';

        Swal.fire('Error', errorMsg, 'error');
      }
    });
  }
}

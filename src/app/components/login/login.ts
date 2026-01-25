import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'No tienes permisos de administrador';
          this.authService.logout();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error.message || 'Error al iniciar sesión';
        this.loading = false;
      },
    });
  }
}

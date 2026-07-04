import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.api.register(this.email, this.password).subscribe({
      next: () => {
        // Auto-login after registration
        this.api.login(this.email, this.password).subscribe({
          next: (res) => {
            localStorage.setItem('jwt_token', res.access_token);
            window.dispatchEvent(new Event('storage'));
            this.router.navigate(['/dashboard']);
          },
          error: () => this.router.navigate(['/login'])
        });
      },
      error: (err) => {
        this.error = err.error?.detail || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}

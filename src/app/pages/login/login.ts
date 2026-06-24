import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Mock login page — selects role and routes to dashboard
 * In production: auth service, JWT tokens, real backend login
 * For CV: demonstrates understanding of role-based routing
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  selectedRole: 'admin' | 'teacher' | 'student' = 'admin';

  constructor(private router: Router) {}

  login(): void {
    // In real app: call auth service, get token, set role in session
    // For now: just store role and route
    sessionStorage.setItem('userRole', this.selectedRole);

    if (this.selectedRole === 'admin') {
      this.router.navigate(['/admin']);
    } else if (this.selectedRole === 'teacher') {
      this.router.navigate(['/teacher']);
    } else {
      this.router.navigate(['/student']);
    }
  }
}

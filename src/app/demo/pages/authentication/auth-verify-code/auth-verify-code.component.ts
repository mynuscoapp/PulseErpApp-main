import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './auth-verify-code.component.html',
  styleUrls: ['./auth-verify-code.component.scss']
})
export class AuthVerifyCodeComponent {
  verifyForm: FormGroup;
  submitted = false;
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.message = '';
    this.error = '';

    if (this.verifyForm.invalid) {
      return;
    }

    const { email, code } = this.verifyForm.value;

    // ✅ Fix: backend expects resetCode, not code
    this.http.post('http://localhost:3000/verify-reset-code', { email, resetCode: code }).subscribe({
      next: () => {
        this.message = 'Code verified! Redirecting...';
        setTimeout(() => {
          // pass email & code to reset-password page
          this.router.navigate(['/reset-password'], { queryParams: { email, code } });
        }, 1000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Invalid code or expired.';
      }
    });
  }
}

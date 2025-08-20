import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { LoginService } from 'src/app/theme/shared/service/login-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export default class ResetPasswordComponent {
  resetForm: FormGroup;
  submitted = false;
  step = 1; // 1=email, 2=verify, 3=new password
  message = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private loginService: LoginService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      resetCode: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // STEP 1 - Send Code
  onSubmitEmail() {
    if (this.resetForm.get('email')?.invalid) return;
    this.message = ''; this.error = '';
    const email = this.resetForm.get('email')?.value;

    this.loginService.forgotPassword(email).subscribe({
      next: () => {
        this.message = 'Reset code sent to your email.';
        this.step = 2;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to send reset code.';
      }
    });
  }

  // STEP 2 - Verify Code

  // STEP 2 - Resend Code
onResendCode() {
  const email = this.resetForm.get('email')?.value;
  if (!email) {
    this.error = 'Email is missing. Please go back and enter your email.';
    return;
  }

  this.message = ''; this.error = '';
  this.loginService.forgotPassword(email).subscribe({
    next: () => {
      this.message = 'A new reset code has been sent to your email.';
    },
    error: (err) => {
      this.error = err.error?.error || 'Failed to resend code.';
    }
  });
}

  onVerifyCode() {
    const email = this.resetForm.get('email')?.value;
    const resetCode = this.resetForm.get('resetCode')?.value;

    this.loginService.verifyResetCode(email, resetCode).subscribe({
      next: () => {
        this.message = 'Code verified. Please set your new password.';
        this.step = 3;
      },
      error: (err) => {
        this.error = err.error?.error || 'Invalid or expired code.';
      }
    });
  }

  // STEP 3 - Reset Password
  onResetPassword() {
    const email = this.resetForm.get('email')?.value;
    const resetCode = this.resetForm.get('resetCode')?.value;
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loginService.resetPassword( email, resetCode, newPassword ).subscribe({
      next: () => {
        this.message = 'Password reset successfully.';
        this.router.navigate(['/authentication/sigin']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to reset password.';
      }
    });
  }
}

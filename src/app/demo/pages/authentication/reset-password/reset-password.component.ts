import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/theme/shared/service/login-service';
import { Router, RouterModule } from '@angular/router'; // Import Router for navigation
import { error } from 'console';


@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  standalone: true
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  message: string = '';
  step: 'verify' | 'setPassword' = 'verify';

  constructor(private formbuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    this.resetForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    });
  }

  onVerifyEmail() {
    if (this.resetForm.invalid) {
      this.message = 'Please enter a valid email.';
      return;
    }

    const email = this.resetForm.value.email;

    this.loginService.verifyEmail(email).subscribe({
      next: (res) => {
        if (res.exists) {
          this.message = 'Email verified. Please set your new password.';
          this.step = 'setPassword';

          this.resetForm.get('password')?.setValidators([
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
          ]);
          this.resetForm.get('confirmPassword')?.setValidators([
            Validators.required
          ]);

          this.resetForm.get('password')?.updateValueAndValidity();
          this.resetForm.get('confirmPassword')?.updateValueAndValidity();

        }
        else {
          this.message = 'Email not found. Please check and try again.';
        }
      },
      error: () => {
        this.message = 'Error verifying email. Please try again.';
      }
    });
  }

  onSetNewPassword() {
    const { password, confirmPassword } = this.resetForm.value;
    
    if (this.resetForm.controls['password'].invalid) {
      this.message = 'Password must be at least 8 characters long and contain at least one number and one special character.';
      return;
    }
    if (password !== confirmPassword) {
      this.message = 'Password do not match.';
      return;
    }

    const email = this.resetForm.value.email;
    this.loginService.updatePassword(email, password).subscribe({
      next: () => {
        // If backend returns success
        this.message = 'Password successfully updated!';
        this.step = 'verify';
        this.resetForm.reset();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: () => {
        // If backend returns error
        this.message = 'Error updating password. Please try again.';
      }
    });
  }
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

}

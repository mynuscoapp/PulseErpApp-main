import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/theme/shared/service/login-service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule,
    FormsModule,
    ReactiveFormsModule, ],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent {
  loginForm: FormGroup;
  logoUrl: string = '';

  constructor(private router: Router,private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  ngOnInit(): void {
    sessionStorage.setItem('isLogged', 'false');
  }

  onSubmit(): void {
  if (this.loginForm.invalid) {
    alert('Please enter a valid email and password.');
    return;
  }
  const { email, password } = this.loginForm.value;
  this.loginService.login(email, password).subscribe({
    next: (res) => {
      // If backend returns success
      this.loginService.setLogedIn();
      sessionStorage.setItem('isLogged', 'true');
      this.router.navigate(['stockinfo']);
    },
    error: (err) => {
      // If backend returns error (invalid credentials)
      alert('Invalid email or password.');
      sessionStorage.setItem('isLogged', 'false');
    }
  });
}
}

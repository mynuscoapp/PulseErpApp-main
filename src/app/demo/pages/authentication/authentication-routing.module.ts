import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./auth-signin/auth-signin.component')
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth-signup/auth-signup.component')
      },
    {
  path: 'reset-password',
  loadComponent: () => import('./reset-password/reset-password.component').then(m => m.default)
      },
      
      {
        path: 'verify-code',
        loadComponent: () => import('./auth-verify-code/auth-verify-code.component').then(m => m.AuthVerifyCodeComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicedownloadComponent } from './main-comp/invoicedownload/invoicedownload.component';
import { WCOrderDownloadComponent } from './main-comp/wcorder-download-component/wcorder-download-component.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import AuthSigninComponent from './demo/pages/authentication/auth-signin/auth-signin.component';
import { BitrixstockComponent } from './main-comp/bitrixstock/bitrixstock.component';
// import { CreatedealComponent } from './main-comp/createdeal/createdeal.component';
import { AuthGuard } from './theme/shared/service/auth.guard';
import { AuthVerifyCodeComponent } from './demo/pages/authentication/auth-verify-code/auth-verify-code.component';
import ResetPasswordComponent from './demo/pages/authentication/reset-password/reset-password.component';
import { AmazonpaymentsuploadComponent } from './main-comp/amazonpaymentsupload/amazonpaymentsupload.component';


const routes: Routes = [
   { path: '', component: AuthSigninComponent },
  { path: 'verify-code', component: AuthVerifyCodeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: AuthSigninComponent
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./demo/pages/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      )
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'pulseusers',
        canActivate: [AuthGuard],

        loadComponent: () => import('./main-comp/pulseusers/pulseusers.component').then((c) => c.PulseusersComponent)
      },
      {
        path: 'basic',
        canActivate: [AuthGuard],
    
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        canActivate: [AuthGuard],
        
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        canActivate: [AuthGuard],
      
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        canActivate: [AuthGuard],
      
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        canActivate: [AuthGuard],
      
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      },
      {
        path: 'invoiceDownload',
        canActivate: [AuthGuard],
      
        component: InvoicedownloadComponent
      },
      {
        path: 'wcOrderDownLoad',
        canActivate: [AuthGuard],
      
        component: WCOrderDownloadComponent
      },
      {
        path: 'stockinfo',
        canActivate: [AuthGuard],
      
        component: BitrixstockComponent,
      },
      {
        path: 'createdeal',
        canActivate: [AuthGuard],
       
        loadComponent:() => import('./main-comp/createdeal/createdeal.component').then((c) => c.CreatedealComponent)
      },
      {
        path: 'amazonpayments',
        canActivate: [AuthGuard],
    
        loadComponent: () => import('./main-comp/amazonpayments/amazonpayments.component').then((c) => c.AmazonpaymentsComponent)
      },
      {
        path: 'amazonpaymentsupload',
        canActivate: [AuthGuard],
        component: AmazonpaymentsuploadComponent
      }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicedownloadComponent } from './main-comp/invoicedownload/invoicedownload.component';
import { WCOrderDownloadComponent } from './main-comp/wcorder-download-component/wcorder-download-component.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import AuthSigninComponent from './demo/pages/authentication/auth-signin/auth-signin.component';
import { BitrixstockComponent } from './main-comp/bitrixstock/bitrixstock.component';
import { CreatedealComponent } from './main-comp/createdeal/createdeal.component';

const routes: Routes = [
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
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'pulseusers',
        loadComponent: () => import('./main-comp/pulseusers/pulseusers.component').then((c) => c.PulseusersComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      },
      {
        path: 'invoiceDownload',
        component: InvoicedownloadComponent
      },
      {
        path: 'wcOrderDownLoad',
        component: WCOrderDownloadComponent,
      },
      {
        path: 'stockinfo',
        component: BitrixstockComponent,
      },
      {
        path: 'createdeal',
        component: CreatedealComponent,
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    AgGridAngular
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    DatePipe
  ]
})
export class AuthenticationModule {}

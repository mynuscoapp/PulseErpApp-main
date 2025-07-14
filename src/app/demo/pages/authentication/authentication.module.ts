import { CommonModule } from '@angular/common';

import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthenticationRoutingModule,BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    AgGridAngular,
    RouterModule], providers: [provideHttpClient(withInterceptorsFromDi()), DatePipe]
})
export class AuthenticationModule {}

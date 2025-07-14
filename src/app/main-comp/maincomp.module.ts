import { CommonModule } from '@angular/common';

import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    AgGridAngular,
    RouterModule
  ], providers: [provideHttpClient(withInterceptorsFromDi()), DatePipe]
})
export class MAinCompModule {}

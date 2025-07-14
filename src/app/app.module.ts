import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvoicedownloadComponent } from './main-comp/invoicedownload/invoicedownload.component';
import { CreatedealComponent } from './main-comp/createdeal/createdeal.component';
import { RichSelectModule } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';


@NgModule({ declarations: [
        
    ],
    exports:[DatePipe
         ], schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    bootstrap: [], imports: [DatePipe, InvoicedownloadComponent, FormsModule,ReactiveFormsModule, CommonModule, BrowserModule, BrowserAnimationsModule,
      CreatedealComponent, AgGridAngular ], providers: [provideHttpClient(withInterceptorsFromDi()), DatePipe] })
export class AppModule { }

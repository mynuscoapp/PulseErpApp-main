import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvoicedownloadComponent } from './main-comp/invoicedownload/invoicedownload.component';
import { CreatedealComponent } from './main-comp/createdeal/createdeal.component';
import { RichSelectModule } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { ConfigService } from './theme/shared/service/ConfigService';

export function initializeApp(configService: ConfigService) {
     return () => configService.getConfig().toPromise().then(config => {
       // Store the fetched config globally or in a service
       // For example, you can assign it to a global object or a dedicated service property
       (window as any).appConfig = config;
       console.log((window as any).appConfig[0].API_URL);
     });
   }

@NgModule({ declarations: [
        
    ],
    exports:[DatePipe
         ], schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    bootstrap: [], imports: [DatePipe, InvoicedownloadComponent, FormsModule,ReactiveFormsModule, CommonModule, BrowserModule, BrowserAnimationsModule,
      CreatedealComponent, AgGridAngular ], providers: [ConfigService,
          {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService],
            multi: true
          }, provideHttpClient(withInterceptorsFromDi()), DatePipe] })
export class AppModule { }

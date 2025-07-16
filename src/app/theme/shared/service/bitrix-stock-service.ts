import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { tap } from 'lodash';
import { catchError } from 'rxjs';
import { BitrixCustomers } from 'src/app/demo/models/BitrixCustomers';
import { BitrixPipeline } from 'src/app/demo/models/BitrixPipeline';
import { BitrixProducts } from 'src/app/demo/models/bitrixproducts';
import { BitrixStoreProduct } from 'src/app/demo/models/BitrixStoreProduct';
import { BitrixStores } from 'src/app/demo/models/BitrixStores';
import { DealHeaderModel } from 'src/app/demo/models/DealHeaderModel';
import { DealProductsRows } from 'src/app/demo/models/DealProductsRows';
import { environment } from 'src/environments/environment';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root',
})
export class BitrixStockService {
  constructor(private http: HttpClient) {
}
   
    bitrixStockList: BitrixStoreProduct[];
    bitrixProductList: BitrixProducts[];
    bitrixPipeLine: BitrixPipeline[];
    bitrixCustomers: BitrixCustomers[];
    bitrixStores: BitrixStores[];

    private bitrixStockUrl = `${environment.bitrixStockUrl}/bitrixstock`;
    private bitrixProductsUrl = `${environment.bitrixStockUrl}/productslist`;
    private bitrixPipelineUrl = `${environment.bitrixStockUrl}/pipelinelist`;
    private bitrixCustomersUrl = `${environment.bitrixStockUrl}/customerlist`;
    private bitrixStoresUrl = `${environment.bitrixStockUrl}/storelist`;

    private createDealHeaderUrl = `${environment.apiUrl}crm.deal.add.json`;
    private createDealProductRowUrl = `${environment.apiUrl}crm.deal.productrows.set.json`;
    
    
    loadBitrixStock() {
        let rowdata: any;
        if (this.bitrixStockUrl.length > 0 && !this.bitrixStockList) {
          return this.http.get(this.bitrixStockUrl);
        } else {
          return this.bitrixStockList;
        }
        return rowdata;
      }

      loadBitrixProducts() {
        let rowdata: any;
        if (this.bitrixProductsUrl.length > 0 && !this.bitrixProductList) {
          return this.http.get(this.bitrixProductsUrl);
        } else {
          return this.bitrixProductList;
        }
        return rowdata;
      }

      loadBitrixPipline() {
        let rowdata: any;
        if (this.bitrixPipelineUrl.length > 0 && !this.bitrixPipeLine) {
          return this.http.get(this.bitrixPipelineUrl); 
        } else {
          return this.bitrixPipeLine;
        }
        return rowdata;
      }

      loadBitrixCustomers() {
        let rowdata: any;
        if (this.bitrixCustomersUrl.length > 0 && !this.bitrixCustomers) {
          return this.http.get(this.bitrixCustomersUrl);
        } else {
          return this.bitrixCustomers;
        }
        return rowdata;
      }

      loadBitrixStoress() {
        let rowdata: any;
        if (this.bitrixStoresUrl.length > 0 && !this.bitrixStores) {
          return this.http.get(this.bitrixStoresUrl);
        } else{
          return this.bitrixStores;
        }
        return rowdata;
      }
  

      createDealHeader(dealHeader: DealHeaderModel) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        const data = JSON.stringify(dealHeader);
        return this.http.post<any>(`${this.createDealHeaderUrl}`,
          data).pipe(
            catchError(error => {
              console.error('Error during POST request:', error);
              throw error; // Re-throw the error or handle it as needed
            })
          );
    }

    createDealProductRows(dealProductRows: DealProductsRows) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      const data = JSON.stringify(dealProductRows);
      return this.http.post<any>(`${this.createDealProductRowUrl}`,
        dealProductRows).pipe(
          catchError(error => {
            console.error('Error during POST request:', error);
            throw error; // Re-throw the error or handle it as needed
          })
        );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { tap } from 'lodash';
import { catchError, Observable, of } from 'rxjs';
import { BitrixCustomers } from 'src/app/demo/models/BitrixCustomers';
import { BitrixOverallStock } from 'src/app/demo/models/BitrixOverallStock';
import { BitrixPipeline } from 'src/app/demo/models/BitrixPipeline';
import { BitrixProducts } from 'src/app/demo/models/bitrixproducts';
import { BitrixStoreProduct } from 'src/app/demo/models/BitrixStoreProduct';
import { BitrixStores } from 'src/app/demo/models/BitrixStores';
import { DealHeaderModel } from 'src/app/demo/models/DealHeaderModel';
import { DealHeaderObject } from 'src/app/demo/models/DealHeaderObject';
import { DealHeaderUpdateModel } from 'src/app/demo/models/DealHeaderUpdateModel';
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
    bitrixOverAllStock: BitrixOverallStock[];

    
    private bitrixStockUrl = `${environment.bitrixStockUrl}/bitrixstock`;
    private bitrixProductsUrl = `${environment.bitrixStockUrl}/productslist`;
    private bitrixPipelineUrl = `${environment.bitrixStockUrl}/pipelinelist`;
    private bitrixCustomersUrl = `${environment.bitrixStockUrl}/customerlist`;
    private bitrixStoresUrl = `${environment.bitrixStockUrl}/storelist`;
    private bitrixOveralStoresUrl = `${environment.bitrixStockUrl}/overallstock`;
    private bitrixApiUrl = `${environment.bitrixStockUrl}/bitrixapiurl`;

    private createDealHeaderUrl = `${(window as any).appConfig[0].API_URL}crm.deal.add.json`;
    private createDealProductRowUrl = `${(window as any).appConfig[0].API_URL}crm.deal.productrows.set.json`;
    private getDealHeaderUrl = `${(window as any).appConfig[0].API_URL}crm.deal.get.json?id=`;
    private getDealProductRowsUrl = `${(window as any).appConfig[0].API_URL}crm.deal.productrows.get.json?id=`;
    private updateDealHeaderUrl = `${(window as any).appConfig[0].API_URL}crm.deal.update.json`;
    private updateDealProductsUrl = `${(window as any).appConfig[0].API_URL}crm.deal.productrows.set.json`;
    private myheaderURL: string ='';
    
    headers = new HttpHeaders()   
        .set('Content-Type', 'application/json');;
    httpOptions = {
        headers: this.headers
    };
    
    loadBitrixStock() {
        let rowdata: any;
        if (this.bitrixStockUrl.length > 0 && !this.bitrixStockList) {
          return this.http.get(this.bitrixStockUrl);
        } else {
          return of(this.bitrixStockList);
        }
        return rowdata;
      }

      loadBitrixOverallStock() {
        let rowdata: any;
        if (this.bitrixOveralStoresUrl.length > 0 && !this.bitrixOverAllStock) {
          return this.http.get(this.bitrixOveralStoresUrl);
        } else {
          return of(this.bitrixOverAllStock);
        }
        return rowdata;
      }

      loadBitrixProducts() {
        let rowdata: any;
        if (this.bitrixProductsUrl.length > 0 && !this.bitrixProductList) {
          return this.http.get(this.bitrixProductsUrl);
        } else {
          return of(this.bitrixProductList);
        }
        return rowdata;
      }

      loadBitrixPipline() {
        let rowdata: any;
        if (this.bitrixPipelineUrl.length > 0 && !this.bitrixPipeLine) {
          return this.http.get(this.bitrixPipelineUrl); 
        } else {
          return of(this.bitrixPipeLine);
        }
        return rowdata;
      }

      loadBitrixCustomers() {
        let rowdata: any;
        if (this.bitrixCustomersUrl.length > 0 && !this.bitrixCustomers) {
          return this.http.get(this.bitrixCustomersUrl);
        } else {
          return of(this.bitrixCustomers);
        }
        return rowdata;
      }

      loadBitrixStoress() {
        let rowdata: any;
        if (this.bitrixStoresUrl.length > 0 && !this.bitrixStores) {
          return this.http.get(this.bitrixStoresUrl);
        } else{
          return of(this.bitrixStores);
        }
        return rowdata;
      }
  

      createDealHeader(dealHeader: DealHeaderModel) {
        let dealObject = new DealHeaderObject;
        dealObject.fields = dealHeader;
        var data = JSON.stringify(dealObject);
        console.log(data);
        return this.http.post<any>(`${this.createDealHeaderUrl}`,
          data, this.httpOptions ).pipe(
            catchError(error => {
              console.error('Error during POST request:', error);
              throw error; // Re-throw the error or handle it as needed
            })
          );
    }

    createDealProductRows(dealProductRows: DealProductsRows) {
      var data = JSON.stringify(dealProductRows);
      console.log(data);
      return this.http.post<any>(`${this.createDealProductRowUrl}`,
        data,this.httpOptions).pipe(
          catchError(error => {
            console.error('Error during POST request:', error);
            throw error; // Re-throw the error or handle it as needed
          })
        );
  }

  loadDealHeader(dealNumber: string) {
    let rowdata: any;
    if (dealNumber.length > 0) {
      console.log(this.getDealHeaderUrl + dealNumber.toString());
      return this.http.get(this.getDealHeaderUrl + dealNumber.toString()).pipe(
        catchError(error => {
          console.error('Error during POST request : ', error);
          throw error;
        })
      );
    }
    return rowdata;

  }
 
  
  // getProductDetails(dealId: number) {
  //   let rowdata: any;
  //   if (this.getDealProductRowsUrl.length > 0) {
  //     console.log(this.getDealProductRowsUrl +dealId.toString());
  //     return this.http.get(this.getDealProductRowsUrl +dealId.toString());

  //   }
  //   return rowdata;
  // }

  getProductDetails(dealHeader: DealHeaderModel){
        console.log(this.getDealProductRowsUrl+dealHeader.ID.toString());
        return this.http.get(this.getDealProductRowsUrl + dealHeader.ID.toString());
    
  }

  updateDealHeader(dealID: number, dealHeader: DealHeaderUpdateModel){
   
        var data = JSON.stringify(dealHeader);
        console.log(data);
        return this.http.post<any>(this.updateDealHeaderUrl,
          data, this.httpOptions ).pipe(
            catchError(error => {
              console.error('Error during POST request:', error);
              throw error; // Re-throw the error or handle it as needed
            })
          );
  }
  

  updateDealProductRows(dealProductRows: DealProductsRows) {
      var data = JSON.stringify(dealProductRows);
      console.log(data);
      return this.http.post<any>(this.updateDealProductsUrl,
        data,this.httpOptions).pipe(
          catchError(error => {
            console.error('Error during POST request:', error);
            throw error; // Re-throw the error or handle it as needed
          })
        );
  }
}
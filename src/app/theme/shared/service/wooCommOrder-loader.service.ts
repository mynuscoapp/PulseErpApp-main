import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class WooCommOrderLoaderService {

  httpOptions = {
    headers: new HttpHeaders()
      .set("Access-Control-Allow-Origin", "*")
      .set('Content-Type', 'application/json')
      .set("observe:", "response")
    // .set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    // .set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

  };

  constructor(private http: HttpClient) {
  }

  private orderDownladUrl = `${environment.wooCommApiUrl}orders?consumer_key=ck_4d46c6022a3f7974e1e4165b2dc810ebcaaccb02&consumer_secret=cs_e56c957456863a1e9d8212f43baeef8355af5da2`;
  private productRowUrl = `${environment.wooCommApiUrl}crm.productrow.list.json?FILTER[OWNER_TYPE]=SI&FILTER[OWNER_ID]=`;
  private companyDetailsUrl = `${environment.wooCommApiUrl}crm.company.get.json?id=`;
  private companyAddressDetailsUrl = `${environment.wooCommApiUrl}crm.address.list.json?FILTER[ENTITY_TYPE_ID]=8&FILTER[ANCHOR_ID]=`;
  private productHSNCodeUrl = `${environment.wooCommApiUrl}products/`


  loadInvoiceHeader(start: string, end: string, pageNumber: number, statusSelected: string) {
    let rowdata: any;
    if (this.orderDownladUrl.length > 0) {
      return this.http.get(this.orderDownladUrl + '&per_page=100&modified_after=' + start + 'T00:00:00&modified_before=' + end + 'T00:00:00&page=' + pageNumber + '&status=' + statusSelected, { observe: 'response' });
    }
    return rowdata;
  }

  getCompanyDetails(companyId: number) {
    let rowdata: any;
    if (this.companyDetailsUrl.length > 0) {
      return this.http.get(this.companyDetailsUrl + companyId);
    }
    return rowdata;
  }

  getCompanyAddressDetails(companyId: number) {
    let rowdata: any;
    if (this.companyAddressDetailsUrl.length > 0) {
      return this.http.get(this.companyAddressDetailsUrl + companyId);
    }
    return rowdata;
  }

  getProductHSNCode(productId: number) {
    let rowdata: any;
    if (this.productHSNCodeUrl.length > 0) {
      return this.http.get(this.productHSNCodeUrl + productId + '?consumer_key=ck_4d46c6022a3f7974e1e4165b2dc810ebcaaccb02&consumer_secret=cs_e56c957456863a1e9d8212f43baeef8355af5da2');
    }
    return rowdata;
  }

  loadProductRow(invoiceNumber: string) {
    let rowdata: any;
    if (this.productRowUrl.length > 0) {
      return this.http.get(this.productRowUrl + invoiceNumber);
    }
    return rowdata;
  }

}

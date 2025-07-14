import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class InvoiceLoaderService {
  constructor(private http: HttpClient) {


  }


  private invoiceDownladUrl = `${environment.apiUrl}crm.item.get.json?entityTypeId=31&id=`;
  private productRowUrl = `${environment.apiUrl}crm.productrow.list.json?FILTER[OWNER_TYPE]=SI&FILTER[OWNER_ID]=`;
  private companyDetailsUrl = `${environment.apiUrl}crm.company.get.json?id=`;
  private companyAddressDetailsUrl = `${environment.apiUrl}crm.address.list.json?FILTER[ENTITY_TYPE_ID]=8&FILTER[ANCHOR_ID]=`;
  private productHSNCodeUrl = `${environment.apiUrl}catalog.product.get.json?id=`;
  private buyToShipToGSTUrl = `${environment.apiUrl}crm.requisite.list.json?`


  loadInvoiceHeader(invoiceNumber: string) {
    let rowdata: any;
    if (this.invoiceDownladUrl.length > 0) {
      return this.http.get(this.invoiceDownladUrl + invoiceNumber);
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
      return this.http.get(this.productHSNCodeUrl + productId);
    }
    return rowdata;
  }

  loadProductRow(invoiceNumber: string, pageNumber: string) {
    let rowdata: any;
    if (this.productRowUrl.length > 0) {
      if (pageNumber)
        return this.http.get(this.productRowUrl + invoiceNumber + '&start=' + pageNumber);
      else
        return this.http.get(this.productRowUrl + invoiceNumber);
    }
    return rowdata;
  }

  loadBuyToShipToGST(companyId: number) {
    let rowdata: any;
    if (this.buyToShipToGSTUrl.length > 0) {
      return this.http.get(this.buyToShipToGSTUrl + 'FILTER[ENTITY_ID]=' + companyId + '&FILTER[ENTITY_TYPE_ID]=4');
    }
    return rowdata;
  }

}

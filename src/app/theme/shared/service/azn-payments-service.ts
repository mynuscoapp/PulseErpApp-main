import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AmazonPayments } from "src/app/demo/models/AmazonPayments";

@Injectable({ 
    providedIn:"root" 
})

export class aznPayment{
    private amazonPaymentsUrl = `${environment.bitrixStockUrl}/paymentSummary`;
    private filterValuesUrl = `${environment.bitrixStockUrl}/filter-values`;

    constructor(private http:HttpClient){  }

    getPayments(params:any):Observable<AmazonPayments[]>{
        console.log("Params in service: ", params);
        let rowData:any;
        
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      let  httpOptions = {
            headers: headers
        };
        
        const paramsQuery =
    `?startdateparam=${params.startdateparam}` +
    `&enddateparam=${params.enddateparam}` +
    `&intervals=${params.intervals}` +
    `&groupby=${params.groupby}` +
    `&filterby=${params.filterby}` +
    `&filtervalue=${params.filtervalue}`;
    console.log("Final Get Url = ", this.amazonPaymentsUrl + paramsQuery);

        try{
        if(this.amazonPaymentsUrl.length>0)
        {
            console.log("sql parameters passed",params);
        return this.http.get<AmazonPayments[]>(this.amazonPaymentsUrl, { headers, params});
        }
    }
    catch(err){
        console.log(err);
    }
    return rowData;
    }

getFilterValues(filterBy: string): Observable<string[]> {
    console.log("Filter By selected: ", filterBy);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let params = new HttpParams().set('filterby', filterBy);
    return this.http.get<string[]>(`${environment.bitrixStockUrl}/filter-values`, { headers, params });
}
}
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

    constructor(private http:HttpClient){  }

    getPayments(params:any):Observable<AmazonPayments[]>{
        let rowData:any;
        
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      let  httpOptions = {
            headers: headers
        };
        //let paramsQuery = 'startDate=' + params.startDate + 'endDate=' + params.endDate + '?Qintervals=' + params.Qintervals + '?groupBY=' + params.groupBY + '?filterBY' + params.filterBY + '?filterVALUE=' + params.filterVALUE ;
        //let paramsQuery = params.startDate + "," + params.endDate + "," + params.Qintervals + "," + params.groupBY + "," + params.filterBY + "," + params.filterVALUE;
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
        //   return this.http.get<AmazonPayments[]>(this.amazonPaymentsUrl,{
        //     params:{
        //         startdateparam:params.startdateparam,
        //         enddateparam:params.enddateparam,
        //         intervals: params.intervals,
        //         groupby: params.groupby,
        //         filterby: params.filterby,
        //         filtervalue: params.filtervalue
        //     }
        //   } );
        return this.http.get<AmazonPayments[]>(this.amazonPaymentsUrl, { headers, params});
        }
    }
    catch(err){
        console.log(err);
    }
    return rowData;
    }
}
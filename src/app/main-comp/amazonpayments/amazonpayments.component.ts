import { Component, ViewChild } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-enterprise';
import { aznPayment } from 'src/app/theme/shared/service/azn-payments-service';
import { AmazonPayments } from 'src/app/demo/models/AmazonPayments';
import { groupBy } from 'lodash';
import { HttpParams } from '@angular/common/http';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-amazonpayments',
  imports: [FormsModule, ReactiveFormsModule, AgGridAngular, SharedModule],
  standalone: true,
  templateUrl: './amazonpayments.component.html',
  styleUrl: './amazonpayments.component.scss'
})


export class AmazonpaymentsComponent {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  aznpaymentsform:FormGroup;
  rowData: AmazonPayments[] = [];

  colDefs: ColDef[] = [
    { headerName: 'Day Period', field: 'period_day', sortable: true, filter: true,width:120 },
    { headerName:'Product', field: 'product', sortable: true, filter: true,width:150 },
    { headerName:'Total orders', field: 'total_orders', sortable: true, filter: true,width:100 },
    { headerName:'Refund Orders', field: 'refund_orders', sortable: true, filter: true,width:100 },
    { headerName:'Revenue', field: 'revenue_ex_gst', sortable: true, filter: true,width:150 },
    { headerName:'COGS', field: 'cogs_ex_gst', sortable: true, filter: true,width:120 },
    { headerName:'Commissions', field: 'commissions_ex_gst', sortable: true, filter: true,width:120},
    { headerName:'Shipping', field: 'shipping_easy_shipex_gst', sortable: true, filter: true,width:100 },
    { headerName:'Marketing', field: 'marketingex_gst', sortable: true, filter: true,width:150 },
    { headerName:'Misc',field: 'misc_ex_gst', sortable: true, filter: true,width:150 }
  ];

startdateparam: Date;
enddateparam: Date;
intervals:string;
groupby: string;
filterby:string;
filtervalue:string;

constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,private aznPayment: aznPayment) {
  this.aznpaymentsform = this.formBuilder.group({
    startdateparam:[''],
    enddateparam: [''],
    intervals:[''],
    groupby:[''],
    filterby:[''],
    filtervalue:['']
  });
};

loadPayments(){
    const params = this.aznpaymentsform.value;
// const params = new HttpParams()
// .set('startdateparam',this.aznpaymentsform.get("startdateparam").value)
// .set('enddateparam', this.aznpaymentsform.get("enddateparam").value)
// .set('intervals',this.aznpaymentsform.get("intervals").value)
// .set('groupby',this.aznpaymentsform.get("groupby").value)
// .set('filterby', this.aznpaymentsform.get("filterby").value)
// .set('filtervalue',this.aznpaymentsform.get("filtervalue").value);

  console.log("Params = ", params);
    console.log(JSON.stringify(params));
    console.log('Calling getPayments()...');

    this.aznPayment.getPayments(params).subscribe({ next: data => {
      console.log("Inside subscribe, data = ",data);
      this.rowData = data as AmazonPayments[];
      console.log(data);
     },

     error: (err) => {
      console.log("Rowdata =" ,this.rowData);
      console.error('API error: ',err);
     },

     complete: ()=>{
      console.log("Request completed");
     }
    });

   
  }

  ngOnInit() {
      
    }
  
    onExport(): void {
      if (this.rowData.length > 1) {
        this.agGrid.api.exportDataAsExcel();
      }
      else {
        alert("No Data to export");
      }
  
  }
}

import { Component, ViewChild, NO_ERRORS_SCHEMA,NgModule} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { aznPayment } from 'src/app/theme/shared/service/azn-payments-service';
import { AmazonPayments } from 'src/app/demo/models/AmazonPayments';
import { groupBy } from 'lodash';
//import { HttpParams } from '@angular/common/http';
import { SharedModule } from 'src/app/theme/shared/shared.module';
//import { AgCharts, AgChartsEnterpriseModule } from 'ag-charts-enterprise';
import 'ag-charts-angular';
import { ColDef, GridApi } from 'ag-grid-enterprise';
import { AgChartOptions, PixelSize } from 'ag-charts-enterprise';
import { AgChartsModule } from 'ag-charts-angular';
//import { labelSpecifier } from 'ag-charts-community/dist/types/src/chart/label';
import { GridOptions, ChartToolPanelName } from 'ag-grid-enterprise';
import { DatePipe } from '@angular/common';
import { event } from 'jquery';
//import { NgSelectModule } from '@ng-select/ng-select';

declare var $: any;


@Component({
  selector: 'app-amazonpayments',
  imports: [FormsModule, ReactiveFormsModule, AgGridAngular, AgChartsModule, SharedModule],
  standalone: true,
  templateUrl: './amazonpayments.component.html',
  styleUrl: './amazonpayments.component.scss'
})


export class AmazonpaymentsComponent {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  gridApi!: GridApi;
  columnApi!: any;
  aznpaymentsform: FormGroup;
  rowData: AmazonPayments[] = [];


  colDefs: ColDef[] = [
    { headerName: 'Period', field: 'period_day',sortable: true, filter: true, width: 120 },
    { headerName: 'Product', field: 'product', sortable: true, filter: true, width: 150 },
    { headerName: 'Total Orders', field: 'total_orders', sortable: true, filter: true, width: 100 },
    { headerName: 'Refund Orders', field: 'refund_orders', sortable: true, filter: true, width: 100 },
    { headerName: 'Income', field: 'revenue_ex_gst', sortable: true, filter: true, width: 150 },
    { headerName: 'COGS', field: 'cogs_ex_gst', sortable: true, filter: true, width: 120 },
    { headerName: 'Charges', field: 'commissions_ex_gst', sortable: true, filter: true, width: 120 },
    { headerName: 'Delivery', field: 'shipping_easy_shipex_gst', sortable: true, filter: true, width: 100 },
    { headerName: 'Ads', field: 'marketingex_gst', sortable: true, filter: true, width: 100 },
    { headerName: 'Misc', field: 'misc_ex_gst', sortable: true, filter: true, width: 100 },
    { headerName: 'CM3', field: 'cm3', sortable: true, filter: true, width: 100 },
    { headerName: 'COGS %', field: 'cogspercent', sortable: true, filter: true, width: 100 },
    { headerName: 'Charges %', field: 'chargespercent', sortable: true, filter: true, width: 100 },
    { headerName: 'Delivery %', field: 'deliverypercent', sortable: true, filter: true, width: 100 },
    { headerName: 'Ads %', field: 'adspercent', sortable: true, filter: true, width: 100 },
    { headerName: 'Misc %', field: 'miscpercent', sortable: true, filter: true, width: 100 },
    { headerName: 'CM3 %', field: 'cm3percent', sortable: true, filter: true, width: 100 }
  ];

  gridOptions: GridOptions = {
  enableCharts: true,
  enableRangeSelection: true,   // REQUIRED for charting
  sideBar: 'columns',           // optional, but nice to have
  chartThemes: ['ag-default'],
  chartToolPanelsDef: {
    panels: ['settings', 'data', 'format'] as ChartToolPanelName[],
    defaultToolPanel: 'settings' as ChartToolPanelName,
  },
  getContextMenuItems: (params) => {
    const result = params.defaultItems?.slice() || [];
    result.push('chartRange');   // adds chart option to right-click
    return result;
  }
};


  chartOptions: AgChartOptions = {
    height: 1000 as PixelSize,
    data: [],
    series: [
      { type: 'bar', direction: 'vertical', xKey: 'period_day', yKey: 'total_orders', yName: 'Total Orders' },
      { type: 'bar', direction: 'vertical', xKey: 'period_day', yKey: 'refund_orders', yName: 'Refund Orders' }
    ],
    legend: { position: 'right' }
  };

  numericColumns: string[] = [];
  selectedColumns: string[] = [];
  startdateparam: Date;
  enddateparam: Date;
  intervals: string;
  groupby: string;
  filterby: string;
  filtervalue: string;
  

filterByOptions = ['Category', 'Product','SKU'];
//filtervalues:  string[] = [];
filtervalues: { value: string }[] = [];

selectedfilterby: string = '';
selectedfiltervalue: string = '';
val: string[] = [];

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private aznPayment: aznPayment) {
    this.aznpaymentsform = this.formBuilder.group({
      startdateparam: [''],
      enddateparam: [''],
      intervals: ['Summary'],
      groupby: ['None'],
      filterby: ['None'],
      filtervalue: ['']
    });
  };

  loadPayments() {
    const params = this.aznpaymentsform.value;
    this.startdateparam = this.aznpaymentsform.get("startdateparam").value;
    this.enddateparam = this.aznpaymentsform.get("enddateparam").value;
    if ( this.startdateparam > this.enddateparam )
    {
      alert("Please select the Optimal Date Range");
      return;
    }
    if(this.intervals === ""){
      alert("Please select the Intervals option");
      return;
    }
    if (this.filterby !== "None" && (this.filtervalue === "" || this.filtervalue === null || this.filtervalue === undefined)) {
      this.filtervalue = "";
    }
    console.log("Params = ", params);
    console.log(JSON.stringify(params));
    console.log('Calling getPayments()...');

    this.aznPayment.getPayments(params).subscribe({
      next: data => {
        this.rowData = data as AmazonPayments[];
        //console.log(data);
        console.log("Period raw value = ", this.rowData[0].period_day, "Type = ", typeof this.rowData[0].period_day);

        // this.rowData.forEach(item => {
        //   item.period_day = this.formatPeriodDay(item.period_day, params.intervals);
        // });
        console.log("Rowdata =", this.rowData);
      },


      error: (err) => {
        console.log("Rowdata =", this.rowData);
        console.error('API error: ', err);
      },

      complete: () => {
        //console.log("Request completed");
        

        this.calculateCM3(this.rowData);
        //this.loadCharts();
      }
    });
  }

  // formatPeriodDay(period: Date, interval: string): Date {
  //   const date = new Date(period);
  //   if (interval === 'Month') {
  //     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //    // return monthNames[Number(period) - 1];
  //   }
  //    else if (interval === 'Weekly') {
  //     const day = date.getDay(); // 0 (Sun) to 6 (Sat)
  //     const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  //     return new Date(date.setDate(diff));
  //   } else {
  //     return period; // Daily or Summary
  //   }
  // }



  loadCharts(data?: any) {
    const rawData = data || this.rowData;

    // Group by month
    const grouped = groupBy(rawData, row =>
      this.datePipe.transform(row.period_day, 'MMM-yyyy')
    );

    const chartData = Object.keys(grouped).map(period_day => {
      const items = grouped[period_day];
      return {
        period_day,
        total_orders: items.reduce((sum, i) => sum + i.total_orders, 0),
        refund_orders: items.reduce((sum, i) => sum + i.refund_orders, 0)
      };
    });

    this.chartOptions = {
      ...this.chartOptions, data: chartData,
    };
    //console.log(chartData);
  }

  calculateCM3(data: AmazonPayments[]) {
    var cogs:any;
    var shipping:any;
    var marketing:any;
    var misc:any;
    var commissions:any;

    data.forEach(item => {

      cogs= item.cogs_ex_gst ? item.cogs_ex_gst :0;
      commissions= item.commissions_ex_gst ? item.commissions_ex_gst :0;
      shipping= item.shipping_easy_shipex_gst? item.shipping_easy_shipex_gst :0;
      marketing= item.marketingex_gst? item.marketingex_gst :0;
      misc= item.misc_ex_gst? item.misc_ex_gst :0;

      item['cm3'] = (item.revenue_ex_gst - (cogs + commissions + shipping + marketing + misc)).toFixed(2);
      
      item['cogspercent'] = (item.revenue_ex_gst ? ((cogs / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['chargespercent'] = (item.revenue_ex_gst ? ((commissions / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['deliverypercent'] = (item.revenue_ex_gst ? ((shipping / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['adspercent'] = (item.revenue_ex_gst ? ((marketing / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['miscpercent'] = (item.revenue_ex_gst ? ((misc / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "% ";

      item['cm3percent'] = (item.revenue_ex_gst ? ((item['cm3'] / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
    });

    console.log("Data with CM3 and percentages: ", data); 
  }


  ngOnInit() {

    // setTimeout(() => {
    //     $('.selectpicker').selectpicker();
    //     $('.selectpicker').selectpicker('val',  '0');
    //   }, 0);     
  }


  onExport(): void {
    if (this.rowData.length > 1) {
      this.agGrid.api.exportDataAsExcel();
    }
    else {
      alert("No Data to export");
    }
  }


onFilterByChange(event: any) {
  this.selectedfilterby = event.target.value;
  console.log("Selected Filter By: ", this.selectedfilterby); 

  this.aznPayment.getFilterValues(this.selectedfilterby).subscribe({
    next: data => {
      console.log("Inside subscribe, data = ", data);
      //this.filtervalues = data as string[];
      //this.filtervalues = data as { value: string }[];
      this.filtervalues = (data as string[]).map(item => ({ value: item }));

      //this.val = this.filtervalues;
      //console.log("Filter values: ", this.filtervalues);
      // setTimeout(() => {
      //   $('.selectpicker').selectpicker();
      //   $('#filtervalue').selectpicker('val',  '0');
      // }, 0); 

    }
  }); 
}
}
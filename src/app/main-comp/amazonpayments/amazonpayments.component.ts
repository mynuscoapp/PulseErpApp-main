import { Component, ViewChild, NO_ERRORS_SCHEMA,NgModule} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GridOptions, ChartToolPanelName, GridReadyEvent } from 'ag-grid-enterprise';
import { DatePipe } from '@angular/common';
import { data, event } from 'jquery';
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
  aznpaymentsform: FormGroup;
  rowData: AmazonPayments[] = [];
  loadingTemplate = '<span class="ag-overlay-loading-center">⏳ Please wait, data is loading...</span>';
  noRowsTemplate = '<span class="ag-overlay-no-rows-center">No data to display</span>';


  colDefs: ColDef[] = [
    { headerName: 'Daily Period', field: 'period_day',sortable: true, filter: true, width: 120 },
    {headerName: 'Monthly Period', field: 'period_month',sortable: true, filter: true, width: 120 },
    {headerName: 'Weekly Period', field: 'period_week',sortable: true, filter: true, width: 120 },
    {headerName: 'Summary', field: 'period',sortable: true, filter: true, width: 120 },
    { headerName: 'Product', field: 'product', sortable: true, filter: true, width: 150 },
    { headerName: 'Category', field: 'category', sortable: true, filter: true, width: 150 },
    { headerName: 'SKU', field: 'sku', sortable: true, filter: true, width: 120 },
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
    { headerName: 'CM3 %', field: 'cm3percent', sortable: true, filter: true, width: 100 },
    {headerName: 'Return percentage',field: 'return_percentage', sortable: true, filter: true, width: 120 }
  ];

  gridOptions: GridOptions = {
  overlayLoadingTemplate: '<span class="ag-overlay-loading-center" aria-live="polite">⏳ Please wait, data is loading...</span>',
  overlayNoRowsTemplate: "No data to display",
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
  

//filterByOptions = ['Category', 'Product','SKU'];
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
    this.agGrid.api.closeToolPanel();
    this.agGrid.loading = true;
    this.agGrid.api.setGridOption('loading', true);

    const params = this.aznpaymentsform.value;
    this.startdateparam = this.aznpaymentsform.get("startdateparam").value;
    this.enddateparam = this.aznpaymentsform.get("enddateparam").value;
    this.intervals = this.aznpaymentsform.get("intervals").value;
    this.groupby = this.aznpaymentsform.get("groupby").value;
    this.filterby = this.aznpaymentsform.get("filterby").value;
    this.filtervalue = this.aznpaymentsform.get("filtervalue").value;
    console.log("Form Values: ", params);
   
    params.startdateparam = this.startdateparam;
    params.enddateparam = this.enddateparam;
    params.intervals = this.intervals;
    params.groupby = this.groupby || "None";
    params.filterby = this.filterby || "None";
    params.filtervalue = this.filtervalue || "None";
    if (this.startdateparam === null || this.startdateparam === undefined)
    {
      alert("Please select the Start Date");
      return;
    }
    if (this.enddateparam === null || this.enddateparam === undefined)
    {
      alert("Please select the End Date");
      return;
    } 
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
      params.filterby = "None";
      params.filtervalue = "None";
    }

    console.log("Params = ", params);
    console.log('Calling getPayments()...');

    if(this.intervals === "Day"){
      //Daily
      //alert("Daily data can take longer time to load, please be patient...");
      this.aznPayment.getPayments(params).subscribe({
      next: data => {
        this.rowData = data as AmazonPayments[];
        //console.log(data);
        console.log("Rowdata =", this.rowData);
        
      },
      error: (err) => {
        console.log("Rowdata =", this.rowData);
        console.error('API error: ', err);
        alert("Data for these selected parameters is not available, please try different options.");
        return;
      },
      complete: () => {
        console.log("Request completed");
        this.calculateCM3(this.rowData);
        this.agGrid.api.setGridOption('loading', false);
        
      }
    });
    this.agGrid.api.setColumnsVisible(['period_day'], true);
    this.agGrid.api.setColumnsVisible(['period_month', 'period_week', 'period'], false );  
    this.gridApi.refreshHeader();    
    }
    else if(this.intervals === "Month"){
      //Monthly
      this.aznPayment.getPayments(params).subscribe({
        next: data => {
          this.rowData = data as AmazonPayments[];
          //console.log(data);
          console.log("Rowdata =", this.rowData);
        },
        error: (err) => {
          console.log("Rowdata =", this.rowData);
          console.error('API error: ', err);
        },
        complete: () => {
          console.log("Request completed");
          this.calculateCM3(this.rowData);
          this.agGrid.api.setGridOption('loading', false);
          
        }
      });
    
    this.agGrid.api.setColumnsVisible(['period_month'], true);
    this.agGrid.api.setColumnsVisible(['period_day', 'period_week', 'period'], false );    
    this.agGrid.api.refreshHeader();
    
    }
    
    else if(this.intervals === "Weekly"){
      //Weekly
      this.aznPayment.getPayments(params).subscribe({
        next: data => {
          this.rowData = data as AmazonPayments[];
          //console.log(data);
          console.log("Rowdata =", this.rowData);
        },
        error: (err) => {
          console.log("Rowdata =", this.rowData);
          console.error('API error: ', err);
        },
        complete: () => {
          console.log("Request completed");
          this.calculateCM3(this.rowData);
          this.agGrid.api.setGridOption('loading', false);
          
        }
      });
    this.agGrid.api.setColumnsVisible(['period_week'], true);
    this.agGrid.api.setColumnsVisible(['period_day', 'period_month', 'period'], false );    
    this.gridApi.refreshHeader();
    }
    else{
      // Summary
      this.aznPayment.getPayments(params).subscribe({
        next: data => {
          this.rowData = data as AmazonPayments[];
          //console.log(data);
          console.log("Rowdata =", this.rowData);
        },
        error: (err) => {
          console.log("Rowdata =", this.rowData);
          console.error('API error: ', err);
          alert("Data for these selected parameters is not available, please try different options.");
          return;
        },
        complete: () => {
          console.log("Request completed");
          this.calculateCM3(this.rowData);
          this.agGrid.api.setGridOption('loading', false);
          
        }
      });
      this.agGrid.api.setColumnsVisible(['period'], true);
      this.agGrid.api.setColumnsVisible(['period_day', 'period_week', 'period_month'], false );
      
    this.gridApi.refreshHeader();
    }
    this.columnaligning();
    this.loadCharts(this.rowData);
    this.agGrid.api.hideOverlay();
  }

   onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
   }

 
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
    var returns:any;

    data.forEach(item => {

      cogs= item.cogs_ex_gst ? item.cogs_ex_gst :0;
      commissions= item.commissions_ex_gst ? item.commissions_ex_gst :0;
      shipping= item.shipping_easy_shipex_gst? item.shipping_easy_shipex_gst :0;
      marketing= item.marketingex_gst? item.marketingex_gst :0;
      misc= item.misc_ex_gst? item.misc_ex_gst :0;
      returns = item.refund_orders? item.refund_orders :0;

      item['cm3'] = (item.revenue_ex_gst - (cogs + commissions + shipping + marketing + misc)).toFixed(2);
      
      item['cogspercent'] = (item.revenue_ex_gst ? ((cogs / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['chargespercent'] = (item.revenue_ex_gst ? ((commissions / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['deliverypercent'] = (item.revenue_ex_gst ? ((shipping / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['adspercent'] = (item.revenue_ex_gst ? ((marketing / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";
      
      item['miscpercent'] = (item.revenue_ex_gst ? ((misc / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "% ";

      item['cm3percent'] = (item.revenue_ex_gst ? ((item['cm3'] / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";

      item['return_percentage'] = (item.total_orders ? ((returns / item.revenue_ex_gst) * 100).toFixed(2) : 0) + "%";

    });
    
    console.log("Data with CM3 and percentages: ", data); 
  }


  ngOnInit() {
    this.agGrid.api.closeToolPanel();
  }

  onExport(): void {
    if (this.rowData.length > 1) {
      this.agGrid.api.exportDataAsExcel();
    }
    else {
      alert("No Data to export");
    }
  }

  onGroupByChange(event:any) {
    this.groupby = event.target.value;
    console.log("Selected Group By: ", this.groupby);
  }

  onIntervalChange(event: any) {
    this.intervals = event.target.value;
    console.log("Selected Intervals: ", this.intervals);
  }


onFilterByChange(event: any) {
  this.selectedfilterby = event.target.value;
  console.log("Selected Filter By: ", this.selectedfilterby); 

  this.aznPayment.getFilterValues(this.selectedfilterby).subscribe({
    next: data => {
      console.log("Inside subscribe, data = ", data);
      this.filtervalues = (data as string[]).map(item => ({ value: item }));
    }
    
  }); 
  console.log(data);
}

onFilterValueChange(event: any) {
  this.filtervalue = event.target.value;
  console.log("Selected Filter Value: ", this.filtervalue);
}


onClearselection(){
  this.agGrid.api.deselectAll();
  this.startdateparam = null;
  this.enddateparam = null; 
  this.intervals = "Summary";
  this.groupby = "None";
  this.filterby = "None";
  this.filtervalue = "";
  this.rowData = [];
  this.agGrid.api.setGridOption('loading', false);
  this.aznpaymentsform.reset();
}

columnaligning(){
if(this.groupby === 'Category'){
  this.agGrid.api.setColumnsVisible(['category'], true);
  this.agGrid.api.setColumnsVisible(['product','sku'],false);
}
else if(this.groupby === 'Product'){
  this.agGrid.api.setColumnsVisible(['product'],true);
  this.agGrid.api.setColumnsVisible(['category','sku'],false);
}
else if(this.groupby=== 'SKU')
{
  this.agGrid.api.setColumnsVisible(['sku'],true);
  this.agGrid.api.setColumnsVisible(['category','product'],false);
}
else{
  this.agGrid.api.setColumnsVisible(['sku'],true);
  this.agGrid.api.setColumnsVisible(['product','category'],false);
}
}
}
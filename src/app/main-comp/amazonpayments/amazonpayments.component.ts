import { Component, ViewChild } from '@angular/core';
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
import { GridOptions, ChartToolPanelName } from 'ag-grid-enterprise';
import { DatePipe } from '@angular/common';


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
    { headerName: 'Day Period', field: 'period_day', sortable: true, filter: true, width: 120 },
    { headerName: 'Product', field: 'product', sortable: true, filter: true, width: 150 },
    { headerName: 'Total orders', field: 'total_orders', sortable: true, filter: true, width: 100 },
    { headerName: 'Refund Orders', field: 'refund_orders', sortable: true, filter: true, width: 100 },
    { headerName: 'Revenue', field: 'revenue_ex_gst', sortable: true, filter: true, width: 150 },
    { headerName: 'COGS', field: 'cogs_ex_gst', sortable: true, filter: true, width: 120 },
    { headerName: 'Commissions', field: 'commissions_ex_gst', sortable: true, filter: true, width: 120 },
    { headerName: 'Shipping', field: 'shipping_easy_shipex_gst', sortable: true, filter: true, width: 100 },
    { headerName: 'Marketing', field: 'marketingex_gst', sortable: true, filter: true, width: 150 },
    { headerName: 'Misc', field: 'misc_ex_gst', sortable: true, filter: true, width: 150 }
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

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private aznPayment: aznPayment) {
    this.aznpaymentsform = this.formBuilder.group({
      startdateparam: [''],
      enddateparam: [''],
      intervals: [''],
      groupby: [''],
      filterby: [''],
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
    if(this.intervals === "" || this.groupby === "" || this.filterby === "" || this.filtervalue === "" ){
      alert("Please selct all the values");
      return;
    }
    console.log("Params = ", params);
    console.log(JSON.stringify(params));
    console.log('Calling getPayments()...');

    this.aznPayment.getPayments(params).subscribe({
      next: data => {
        console.log("Inside subscribe, data = ", data);
        this.rowData = data as AmazonPayments[];
        // this.updateChart();
        //console.log(data);
      },

      error: (err) => {
        console.log("Rowdata =", this.rowData);
        console.error('API error: ', err);
      },

      complete: () => {
        //console.log("Request completed");
        this.loadCharts();
      }
    });
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


  ngOnInit() {
    this.numericColumns = this.colDefs
      .map(col => col.field!)
      .filter(f => ['total_orders', 'refund_orders', 'revenue_ex_gst', 'cogs_ex_gst',
        'commissions_ex_gst', 'shipping_easy_shipex_gst', 'marketingex_gst', 'misc_ex_gst'].includes(f));

  }

  onExport(): void {
    if (this.rowData.length > 1) {
      this.agGrid.api.exportDataAsExcel();
    }
    else {
      alert("No Data to export");
    }
  }


  ascendingchartFromGrid() {
    if (!this.gridApi) return;

    const rowData: any[] = [];
    this.gridApi.forEachNode((node) => rowData.push(node.data));

    // ✅ sort ascending by date (assuming your field is "period_day")
    const sorted = rowData.sort((a, b) => {
      return new Date(a.period_day).getTime() - new Date(b.period_day).getTime();
    });

    // build chart data
    this.chartOptions = {
      ...this.chartOptions,
      data: sorted,
    };
  }

  getWeekNumber(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil((((+d - +yearStart) / 86400000) + 1) / 7);
    return `W${weekNum}-${d.getUTCFullYear()}`;  // Example: W34-2025
  }

  loadWeeklyChart(data?: any) {
    const rawData = data || this.rowData;

    // Group by WEEK instead of month
    const grouped = groupBy(rawData, row => {
      const dt = new Date(row.period_day);
      return this.getWeekNumber(dt);
    });

    const chartData = Object.keys(grouped).map(period_day => {
      const items = grouped[period_day];
      return {
        period_day,
        total_orders: items.reduce((sum, i) => sum + i.total_orders, 0),
        refund_orders: items.reduce((sum, i) => sum + i.refund_orders, 0)
      };
    });

    this.chartOptions = {
      ...this.chartOptions,
      data: chartData
    };
  }

}





// updateChart() {
//   const grouped = groupBy(this.rowData, row =>
//     this.datePipe.transform(row.period_day, 'MMM-yyyy')
//   );
//   //console.log("rowData = " + this.rowData);

//   const chartData = Object.keys(grouped).map(period_day => {
//     const items = grouped[period_day];
//     const obj: any = { period_day };
//     this.selectedColumns.forEach(col => {
//       obj[col] = items.reduce((sum, i) => sum + (i[col] || 0), 0);
//       console.log("col " + col);
//     });
//     return obj;
//   });

//   const series = this.selectedColumns.map(col => ({
//     type: 'bar',
//     xKey: 'period_day',
//     yKey: col,
//     yName: col
//   }));
//   console.log("series = " + series);

//   this.chartOptions = {...this.chartOptions,
//     data: chartData,
//     legend: { position: 'right' }
//   };
// }

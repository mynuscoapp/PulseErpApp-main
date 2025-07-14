import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { BitrixStockService } from 'src/app/theme/shared/service/bitrix-stock-service';

@Component({
  selector: 'app-bitrixstock',
  imports: [FormsModule, ReactiveFormsModule, AgGridAngular],
  templateUrl: './bitrixstock.component.html',
  styleUrl: './bitrixstock.component.scss'
})
export class BitrixstockComponent {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  bitrixstockForm: FormGroup;
  stockData?: any;
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private bitrixstockservice: BitrixStockService) {
      this.bitrixstockForm = this.formBuilder.group({
        
      });
    };

    colDefs: any = [
        { headerName: 'Store', field: 'storeId', sortable: true, resizable: true, filter: true },
        { headerName: 'Image',field: 'preview_picture', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100, cellRenderer: (params) => `<img style="height: 30px; width: 30px" src=${params.data.preview_picture} />` },
        { headerName: 'Product', field: 'productName', sortable: true, resizable: true, filter: true },
        { headerName: 'Available', field: 'quantity', sortable: true, resizable: true, filter: true },
        { headerName: 'Reserved', field: 'quantityReserved', sortable: true, resizable: true, filter: true },
        ];
    
  ngOnInit(): void {
    this.bitrixstockservice.loadBitrixStock().subscribe((data: any) => {
      console.log(data);
      this.stockData = data;
    });
  }

  onExport(): void {
    this.agGrid.api.exportDataAsExcel();
  }
}

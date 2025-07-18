import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { values } from 'lodash';
import { BitrixProducts } from 'src/app/demo/models/bitrixproducts';
import { BitrixStockService } from 'src/app/theme/shared/service/bitrix-stock-service';
import { environment } from 'src/environments/environment';
import { AgGridAngular } from 'ag-grid-angular';
import { AutoWidthCalculator, ColDef, GridOptions, ModuleRegistry, RowSelectionOptions } from 'ag-grid-enterprise';
import 'ag-grid-enterprise';
import { BitrixPipeline } from 'src/app/demo/models/BitrixPipeline';
import { BitrixCustomers } from 'src/app/demo/models/BitrixCustomers';
import { BitrixStores } from '../../demo/models/BitrixStores';
import { BitrixStoreProduct } from 'src/app/demo/models/BitrixStoreProduct';
import { DealHeaderModel } from 'src/app/demo/models/DealHeaderModel';
import { DealProductsRows } from 'src/app/demo/models/DealProductsRows';
import { DealProductList } from 'src/app/demo/models/DealProductList';
import { error } from 'console';

@Component({
  selector: 'app-createdeal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AgGridAngular ],
  templateUrl: './createdeal.component.html',
  styleUrl: './createdeal.component.scss'
})




export class CreatedealComponent {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
    createDealForm: FormGroup;
  isLoading: boolean = false;
  productNamesList: any = [];
  productsList: BitrixProducts[] = []
  rowData: BitrixProducts[] = [];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };

  colDefs: ColDef[] ;
  gridOptions: GridOptions;
  bitrixPipelineList: BitrixPipeline[];
  bitrixCustomers: BitrixCustomers[];
  bitrixStores: BitrixStores[];
  bitrixStoreProducts: BitrixStoreProduct[];
  storeId: number;
  ftotal = 0;
  finalTotal: number;
  
  
   constructor(private formBuilder: FormBuilder,  private bitrixstockservice: BitrixStockService) {
        
      this.createDealForm = this.formBuilder.group({
        
        pipelineOptions: ['', [Validators.required]],
        customersOptions: ['', [Validators.required]],
        storesOptions: ['', [Validators.required]],
        dealName: ['', [Validators.required]],
        // FromDate: ['', [Validators.required]],
        // ToDate: ['', [Validators.required]],
        // selectedOption: ['', [Validators.required]]
      });

     
      this.gridOptions = <GridOptions>{
        singleClickEdit: true,
        rowHeight: 50,
        enableAdvancedFilter: true,
        onGridReady: function (params) {
          // Following line to make the currently visible columns fit the screen  
          params.api.sizeColumnsToFit();
          // Following line dymanic set height to row on content
          params.api.resetRowHeights();
      },
      };
    }
    ;

    onSubmit() {
      this.GenrateDeal();
   }

  private GenrateDeal() {
    let dealHeader = new DealHeaderModel;
    dealHeader.TITLE = this.createDealForm.get("dealName").value;
    dealHeader.TYPE_ID = this.createDealForm.get("pipelineOptions").value;
    dealHeader.CURRENCY_ID = 'INR';
    dealHeader.COMPANY_ID = this.createDealForm.get("customersOptions").value;
    //dealHeader.CATEGORY_ID = 
    dealHeader.OPPORTUNITY = this.finalTotal;
    dealHeader.OWNER_TYPE = 'D';
    //dealHeader.STAGE_ID = 'NEW';
    dealHeader.COMMENTS = 'This deal was created automatically via the Angular application.';

    this.bitrixstockservice.createDealHeader(dealHeader).subscribe(
      response => {
        console.log('POST request successful:', response);
        const deal_id = response.result;
        console.log(deal_id);
        // Process the response data here
        let dealProducts = new DealProductsRows;
        dealProducts.id = deal_id;
        let dealProductList = this.GetProductRowsList();
        dealProducts.rows = dealProductList;
        console.log(dealProducts);
        this.bitrixstockservice.createDealProductRows(dealProducts).subscribe(
          response => {
            console.log('POST request successful:', response);
            alert('Deal Created Successfully');
          },
          error => {
            console.error('Error receiving POST response:', error);
          }
        );
      },
      error => {
        console.error('Error receiving POST response:', error);
      }
    );
  }

    GetProductRowsList() {
      let rowsList: DealProductList[] = [];
      for(let i=0; i< this.rowData.length; i++) {
        let productRow = new DealProductList;
        productRow.PRODUCT_ID = this.rowData[i].id;
        productRow.PRICE = this.rowData[i].RRP;
        productRow.QUANTITY = this.rowData[i].quantity;
        productRow.DISCOUNT_RATE= this.rowData[i].discount;
        productRow.MEASURE_CODE = 'pcs';
        rowsList.push(productRow);
        console.log('productRow.PRODUCT_ID ' + productRow.PRODUCT_ID)
      }
      return rowsList;

    }

    ngOnInit() {
      this.rowData.push(new BitrixProducts);
      this.bitrixstockservice.loadBitrixProducts().subscribe((data: any) => {
        this.productNamesList = data.map(x => x.productName);
        this.productsList = data;
        console.log(this.productNamesList);
        this.createColumnsDefinition();
        
      });

      this.bitrixstockservice.loadBitrixPipline().subscribe((data: any) => {
        this.bitrixPipelineList = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixCustomers().subscribe((data: any) => {
        this.bitrixCustomers = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixStoress().subscribe((data: any) => {
        this.bitrixStores = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixStock().subscribe((data: any) => {
        this.bitrixStoreProducts = data;
        console.log(data);
      });
    }

    ngAfterViewInit() {
      
    }

    createColumnsDefinition(){
      this.colDefs = [
        { headerName: 'Product', field: 'productName', sortable: true, width : 400, resizable: true, filter: true, editable: true, cellEditor: 'agRichSelectCellEditor',cellEditorParams: {values : this.productNamesList,
          searchType: "matchAny",
          allowTyping: true,
          filterList: true,
          highlightMatch: true,
          valueListMaxHeight: 220,
        }},
        { headerName: 'Image',field: 'PREVIEW_PICTURE', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100, cellRenderer: (params) => `<img style="height: 30px; width: 30px" src=${params.data.PREVIEW_PICTURE} />` },
        { headerName: 'Quantity', field: 'quantity', sortable: true, resizable: true, filter: true, editable: true,width:150 },
        { headerName: 'Price', field: 'RRP', sortable: true, resizable: true, filter: true, editable: true, width:100 },
        { headerName: 'Discount %', field: 'discount', sortable: true, resizable: true, filter: true, editable: true,width:140 },
        { headerName: 'Stock', field: 'stock', sortable: true, resizable: true, filter: true,width:100 },
        { headerName: 'Reserved', field: 'reserved', sortable: true, resizable: true, filter: true,width:130 },
        { headerName: 'Total', field: 'total', sortable: true, resizable: true, filter: true },
        ];
        
 }
    onAddProductRoe(){
      this.rowData.push(new BitrixProducts);
      this.agGrid.api.setGridOption('rowData', this.rowData);
    }

    onDeleteProductRowClick() {
      const selectedData = this.agGrid.api.getSelectedRows();
      const res = this.agGrid.api.applyTransaction({ remove: selectedData });
      console.log(res.remove);
      let filterList : BitrixProducts[];
      res.remove.forEach( x => {
        console.log(x);
        filterList = this.rowData.filter((item: any) => !item.productName.includes(x.data["productName"]));
      });
      console.log(filterList);
       this.rowData = filterList;
      this.agGrid.api.setGridOption('rowData', this.rowData);
    }

    onCellValueChanged(event: any) {
      // Access the changed row data and column details
      console.log('Cell value changed:', event.data, event.colDef.field, event.newValue);
      //alert('fieldname ' + event.colDef.field); 
      this.storeId = this.createDealForm.get('storesOptions')?.value;
      // Perform actions based on the new value
      if (event.colDef.field === 'productName') {
          const rowId = event.rowIndex;
          var filterRow = this.productsList.filter(x => x.productName === event.newValue)[0];
          console.log(this.storeId);
          console.log(event.newValue);
          var stockAvail = this.bitrixStoreProducts.filter(x => x.id_of_store == this.storeId && x.productName == event.newValue)[0]
          console.log(stockAvail);
          filterRow.stock = stockAvail.quantity;
          filterRow.reserved = stockAvail.quantityReserved;
          this.rowData[rowId] = filterRow;
          this.agGrid.api.setGridOption('rowData', this.rowData);
          console.log(this.rowData[rowId].PREVIEW_PICTURE);

      } 
      else if ( event.colDef.field === 'quantity') {
        //alert('Qaumtity changed');
        const rowId = event.rowIndex;
        // CHECK IF QUANTITY IS LESSSER THAN AVAILABLE STOCK ----
        if(this.rowData[rowId].quantity<= this.rowData[rowId].stock){
          this.rowData[rowId].total = this.rowData[rowId].quantity * this.rowData[rowId].RRP;
        this.agGrid.api.setGridOption('rowData', this.rowData);
        //this.onTotalCal(this.rowData[rowId].total)

        
        //---------------Calling function to calculate Subtotal value and display it ---------------
        var totalcost = 0 , i =0;
        for( i=0; i<this.rowData.length; i++){
          totalcost = totalcost + this.rowData[i].total;
        }
        this.onTotalCal(totalcost)
        }
        else{
          alert("Entered quantity is larger than stock availability");
          this.rowData[rowId].quantity = 0;
        }
        
      } 
      else if( event.colDef.field === 'discount'){
        const rowId = event.rowIndex;
        var calDisc = this.rowData[rowId].total - (this.rowData[rowId].total * (this.rowData[rowId].discount / 100))
        this.rowData[rowId].total = calDisc
        this.agGrid.api.setGridOption('rowData', this.rowData);

        //---------------Calling function to calculate Subtotal value and display it ---------------
        var totalcost = 0,i =0;
        for( i=0; i<this.rowData.length; i++){
          totalcost = totalcost + this.rowData[i].total;
        }
        this.onTotalCal(totalcost)
      }

    }

    //---------------Called function to calculate Subtotal value and display it ---------------

    onTotalCal(stotal){
    
      //const inputElement = document.getElementById('subtotal') as HTMLInputElement;
      const totalElement = document.getElementById('subtotal') as HTMLInputElement; 
      const gstElement = document.getElementById('gst') as HTMLInputElement;
      const finalElement = document.getElementById('finaltotal') as HTMLInputElement;
        
      var subtotal=0, calgst = 0, fintot = 0 
      subtotal = stotal;
      calgst = subtotal * 0.18;
   
      totalElement.value = subtotal.toString();
      gstElement.value = calgst.toString();

      fintot = parseInt(totalElement.value) + parseInt(gstElement.value);
      finalElement.value= fintot.toString();
      this.finalTotal = fintot;
      this.agGrid.api.setGridOption('rowData', this.rowData);
    }

  
}

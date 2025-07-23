import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { values } from 'lodash';
import { BitrixProducts } from 'src/app/demo/models/bitrixproducts';
import { BitrixStockService } from 'src/app/theme/shared/service/bitrix-stock-service';
import { environment } from 'src/environments/environment';
import { AgGridAngular } from 'ag-grid-angular';
import { _isVisible, AutoWidthCalculator, ColDef, GridOptions, ModuleRegistry, RowSelectionOptions } from 'ag-grid-enterprise';
import 'ag-grid-enterprise';
import { BitrixPipeline } from 'src/app/demo/models/BitrixPipeline';
import { BitrixCustomers } from 'src/app/demo/models/BitrixCustomers';
import { BitrixStores } from '../../demo/models/BitrixStores';
import { BitrixStoreProduct } from 'src/app/demo/models/BitrixStoreProduct';
import { DealHeaderModel } from 'src/app/demo/models/DealHeaderModel';
import { DealProductsRows } from 'src/app/demo/models/DealProductsRows';
import { DealProductList } from 'src/app/demo/models/DealProductList';
import { error } from 'console';
import { BitrixOverallStock } from 'src/app/demo/models/BitrixOverallStock';

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
  bitrixOverAllStock: BitrixOverallStock[];
  colDefs: ColDef[] ;
  gridOptions: GridOptions;
  bitrixPipelineList: BitrixPipeline[];
  bitrixCustomers: BitrixCustomers[];
  bitrixStores: BitrixStores[];
  bitrixStoreProducts: BitrixStoreProduct[];
  storeId: number;
  ftotal: string;
  finalTotal: string;
  calGST: string;
  selectedCustomer: string='';
  customerSelect: boolean = true;
  dealNum: string;
  
  errorDisplayMsg: string;

  
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
      
      if(this.customerSelect)
      {
        this.GenrateDeal();
      }
      else{
        alert("Please select the customer");
       // this.customerSelect = this.isCustomerInvalid();
      }
   }

  private GenrateDeal() {
    this.errorDisplayMsg = '';
    if (!this.IsQuantityEntered())
    {
        this.errorDisplayMsg  = 'Please enter quantity!';
        return;
    }
    let dealHeader = new DealHeaderModel;
    dealHeader.TITLE = this.createDealForm.get("dealName").value;
    dealHeader.TYPE_ID = this.createDealForm.get("pipelineOptions").value;
    dealHeader.CURRENCY_ID = 'INR';
    dealHeader.COMPANY_ID = this.createDealForm.get("customersOptions").value;
    //dealHeader.CATEGORY_ID = 
    dealHeader.OPPORTUNITY = +this.finalTotal;
    dealHeader.OWNER_TYPE = 'D';
    dealHeader.ASSIGNED_BY_ID = 1;
    //dealHeader.STAGE_ID = 'NEW';
    dealHeader.COMMENTS = 'This deal was created automatically via the Angular application.';

    this.bitrixstockservice.createDealHeader(dealHeader).subscribe(
      response => {
        console.log('POST request successful:', response);
        const deal_id = response.result;

        console.log(deal_id);
        this.dealNum = "  Deal ID : " + deal_id.toString();

        //console.log(deal_id);

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
            alert('Error creating deal : '+ error);
          }
        );
      },
      error => {
        alert('Error creating deal products :'+ error);
      }
    );
  }

  IsQuantityEntered() {
    let hasQuantity = true;
    for(let i=0; i< this.rowData.length; i++) {
        if (!this.rowData[i].quantity || (this.rowData[i].quantity === 0)) {
          this.onFlashOneCell(i, 'quantity');
          hasQuantity = false;
        }
      }

      return hasQuantity;
  }
    GetProductRowsList() {
      let rowsList: DealProductList[] = [];
      for(let i=0; i< this.rowData.length; i++) {
        if(this.rowData[i].productName && this.rowData[i].id) {
          if (this.rowData[i].quantity) {
            let productRow = new DealProductList;
            productRow.PRODUCT_ID = this.rowData[i].id;
            productRow.PRICE = this.rowData[i].RRP;
            productRow.QUANTITY = this.rowData[i].quantity;
            productRow.DISCOUNT_RATE= this.rowData[i].discount;
            productRow.MEASURE_CODE = 'pcs';
            rowsList.push(productRow);
          } else {
            this.onFlashOneCell(i, 'quantity');
          }
        }
      }
      return rowsList;

    }

    onFlashOneCell(rowIndex: number, colName: string) {
      // pick fourth row at random
      const rowNode = this.agGrid.api.getDisplayedRowAtIndex(rowIndex)!;
      // pick 'c' column
      this.agGrid.api.flashCells({ rowNodes: [rowNode], columns: [colName], flashDuration: 10000, flashDelay: 10000 });
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

      this.bitrixstockservice.loadBitrixOverallStock().subscribe((data: any) => {
        this.bitrixOverAllStock = data;
        console.log(data);
      });
    }

    ngAfterViewInit() {
      
    }

    createColumnsDefinition(){
      this.colDefs = [
        { headerName: 'Product', field: 'productName', sortable: true, width : 280, resizable: true, filter: true, editable: true, cellEditor: 'agRichSelectCellEditor',cellEditorParams: {values : this.productNamesList,
          searchType: "matchAny",
          allowTyping: true,
          filterList: true,
          highlightMatch: true,
          valueListMaxHeight: 220,
          
        },
        cellStyle: {border: '1px solid #c1c6c7ff' }
      },
       { headerName: 'Img',field: 'PREVIEW_PICTURE', sortable: true, resizable: true, filter: true, 
          checkboxSelection: false, width: 100, cellRenderer: (params) => `<img style="height: 30px; width: 30px" src=${params.data.PREVIEW_PICTURE} />`,
          cellStyle: {border: '1px solid #c1c6c7ff' } },
       { headerName: 'Qtty', field: 'quantity', sortable: true, resizable: true, filter: true, editable: true,width:100,
        cellStyle: {border: '1px solid #c1c6c7ff' }, cellEditor: 'numericCellEditor'},//,  cellEditorParams: {min: 0},
       { headerName: 'Price', field: 'RRP', sortable: true, resizable: true, filter: true, editable: true, width:100,
          cellStyle: {border: '1px solid #c1c6c7ff' } }, 
       { headerName: 'Tax Incl', field: 'VAT_INCLUDED', sortable: true, resizable: true, filter: true, editable: true, width:100,
          cellStyle: {backgroundColor: '#ecf1f2ff', border: '1px solid #c1c6c7ff' }},
       { headerName: 'Disc %', field: 'discount', sortable: true, resizable: true, filter: true, editable: true,width:100,
          cellStyle: {border: '1px solid #c1c6c7ff' } },
       { headerName: 'Stock', field: 'stock', sortable: true, resizable: true, filter: true,width:100, 
          cellStyle: { backgroundColor: '#ecf1f2ff',border: '1px solid #c1c6c7ff' }},
       { headerName: 'Reserved', field: 'reserved', sortable: true, resizable: true, filter: true,width:100,
          cellStyle: { backgroundColor: '#ecf1f2ff',border: '1px solid #c1c6c7ff' } },
       { headerName: 'Total Price', field: 'total', sortable: true, resizable: true, filter: true,width:150,
          cellStyle: {backgroundColor: '#ecf1f2ff', border: '1px solid #c1c6c7ff' } }
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
        
        //this.finalTotal = this.finalTotal - this.rowData[x].total.value;
      });
      console.log(filterList);
       this.rowData = filterList;
      this.agGrid.api.setGridOption('rowData', this.rowData);
    }

 
    onCellValueChanged(event: any) {
      //myData: any[] = [];
      // Access the changed row data and column details
      console.log('Cell value changed:', event.data, event.colDef.field, event.newValue);
      //alert('fieldname ' + event.colDef.field); 
      this.storeId = this.createDealForm.get('storesOptions')?.value;
      // Perform actions based on the new value
      if (event.colDef.field === 'productName') {
          const rowId = event.rowIndex;
          // const exists = this.myData.some(p=>p.productName===event.productName);
          // for (i= 0;i<=rowId;i++){
            
          //     alert(event.productId);
          //     //alert(this.rowData[i].id);
          //     if (event.productId === this.rowData[i].id){
          //       alert('Duplicates');
          //     }
            
          // }
          // var productSelected =  event.newValue;
          // alert(productSelected);
          // for (i= 0;i<rowId;i++){
          //   if (productSelected = this.rowData[i].productName)
          //   {
          //     alert(productSelected);
          //     //alert(this.rowData[i].productName);
            
          //   }
          // }


          // const exists = this.productsList.some(x => x.productName === event.newValue)[0];
          // const exists = this.rowData.some(x=> x.productName === event.productName);
          // if(exists)
          // {
          //   alert(exists);
          // }
          
          if (this.rowData.filter(x => x.productName == event.newValue).length > 1){
            alert('Product already added!');
            event.node.setDataValue("productName", "");
            return;
          }
          var filterRow = this.productsList.filter(x => x.productName == event.newValue)[0];
          
          console.log(this.storeId);
          console.log(filterRow);
          console.log(event.newValue);
          var stockAvail = this.bitrixOverAllStock.filter(x => x.productId == filterRow.id)[0];
          console.log(stockAvail.overallQuantity);
          console.log(stockAvail);
          filterRow.quantity = 0;
          filterRow.total = 0;
          filterRow.stock = stockAvail.overallQuantity;
          filterRow.reserved = stockAvail.overallreserved;
          console.log(filterRow.VAT_INCLUDED);
          this.rowData[rowId] = { ...this.rowData[rowId], ...filterRow };
          this.agGrid.api.setGridOption('rowData', this.rowData);
          
          
      } 
      else if ( event.colDef.field === 'quantity') {
        //alert('Qaumtity changed');
        const rowId = event.rowIndex;
       
        this.rowData[rowId].total = this.rowData[rowId].quantity * this.rowData[rowId].RRP;
        this.agGrid.api.setGridOption('rowData', this.rowData);
        //this.onTotalCal(this.rowData[rowId].total)

        
        //---------------Calling function to calculate Subtotal value and display it ---------------
        this.GetTotals();
        } else if( event.colDef.field === 'discount'){
        const rowId = event.rowIndex;
        var calDisc = this.rowData[rowId].total - (this.rowData[rowId].total * (this.rowData[rowId].discount / 100))
        this.rowData[rowId].total = calDisc
        this.agGrid.api.setGridOption('rowData', this.rowData);
        this.GetTotals();
      }

    }

  private GetTotals() {
    var totalcost:number = 0, i:number = 0;
    var gstTotal:number = 0;
    var subTotal:number = 0;
    for (i = 0; i < this.rowData.length; i++) {
      totalcost = totalcost + +this.rowData[i].total;
      if (this.rowData[i].VAT_INCLUDED == 'Y') {
        
        this.rowData[i].tax_rate = this.rowData[i].tax_rate ?? 0;
        subTotal += (+this.rowData[i].total / (1 + (+this.rowData[i].tax_rate / 100)));
        gstTotal += +this.rowData[i].total - (+this.rowData[i].total / (1 + (+this.rowData[i].tax_rate / 100)));
      } else {
        //alert(this.rowData[i].tax_rate);
        gstTotal += (+this.rowData[i].total * (+this.rowData[i].tax_rate / 100));
        subTotal += +this.rowData[i].total - (+this.rowData[i].total * (+this.rowData[i].tax_rate / 100));

      }
    }
    this.finalTotal= totalcost.toFixed(2).toString(); // CHANGED HERE
    this.calGST = gstTotal.toFixed(2).toString();
    //this.finalTotal = subTotal.toFixed(2).toString();
    this.ftotal = subTotal.toFixed(2).toString();
  
    //this.ftotal = totalcost.toFixed(2).toString();
  }
  

    //---------------Called function to calculate Subtotal value and display it ---------------

    onTotalCal(stotal){
    
    //   const totalElement = document.getElementById('subtotal') as HTMLInputElement; 
    //   const gstElement = document.getElementById('gst') as HTMLInputElement;
    //   const finalElement = document.getElementById('finaltotal') as HTMLInputElement;
        
       //var subtotal=0, calgst = 0
       var subtotal= 0, fintot = 0 ;
       subtotal = stotal;
       fintot = +this.finalTotal + +this.calGST;
       this.ftotal= this.finalTotal;
       
    //   calgst = subtotal * 0.18;
   
    //   //totalElement.value = subtotal.toString();
    //   gstElement.value = calgst.toString();

    //   fintot = parseInt(totalElement.value) + parseInt(gstElement.value);
    //   finalElement.value= fintot.toString();
    //   //this.finalTotal = fintot;
    //   this.agGrid.api.setGridOption('rowData', this.rowData);
    }
   isCustomerInvalid(){
      //return !this.selectedCustomer || this.selectedCustomer === '';
      if (this.createDealForm.get("customersOptions").value != "")
      {
        this.customerSelect = true;
      }
      else
      {
        //this.createDealForm.se
        this.customerSelect = false;
        //this.createDealForm.addValidators()
      }

    }
       
   
}
 

 
  

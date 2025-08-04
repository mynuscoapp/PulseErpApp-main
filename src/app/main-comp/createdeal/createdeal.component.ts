import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders} from '@angular/common/http';
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
import { DealHeaderUpdateModel } from 'src/app/demo/models/DealHeaderUpdateModel';

@Component({
  selector: 'app-createdeal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, AgGridAngular],
  templateUrl: './createdeal.component.html',
  styleUrl: './createdeal.component.scss'
})



export class CreatedealComponent {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  createDealForm: FormGroup;
  isLoading: boolean = true;
  updatDealDisable:boolean = true;
  productNamesList: any = [];
  productsList: BitrixProducts[] = []
  rowData: BitrixProducts[] = [];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  
  dealHeader: DealHeaderModel;
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
  customerSelect: boolean = false;
  dealNum: string;
  isCustomerInvalid:boolean = false;
  startPage!: string
  listcount: number = 0;
  numberOfRows:string ="";
  isDealFetched:boolean = false;
  isCustomerDiabled:boolean = true;
  fetchDealId: number;

  errorDisplayMsg: string;

  
   constructor(private formBuilder: FormBuilder,  private bitrixstockservice: BitrixStockService, private http: HttpClient) {
        
      this.createDealForm = this.formBuilder.group({
        
        pipelineOptions: ['', [Validators.required]],
        customersOptions: ['', [Validators.required]],
        storesOptions: ['', [Validators.required]],
        dealName: ['', [Validators.required]],
        updateDealnum: ['']
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
        this.errorDisplayMsg = "Please select the customer";
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
    dealHeader.TYPE_ID = "SALE";
    dealHeader.COMPANY_ID =  this.createDealForm.get("customersOptions").value;
    //dealHeader.CATEGORY_ID = 
     dealHeader.OPPORTUNITY = +this.ftotal;
    dealHeader.ASSIGNED_BY_ID = '1';
    //dealHeader.STAGE_ID = 'NEW';
    dealHeader.COMMENTS = 'This deal was created automatically via the Angular application.';
    console.log(dealHeader);
    this.bitrixstockservice.createDealHeader(dealHeader).subscribe(
      response => {
        console.log('POST request successful:', response);
        const deal_id = response.result;
        console.log(deal_id);
        this.dealNum = "  Deal ID : " + deal_id.toString();

        // Process the response data here
        let dealProducts = new DealProductsRows;
        dealProducts.id = deal_id;
        let dealProductList = this.GetProductRowsList(deal_id);
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

      
    GetProductRowsList(dealId: number) {
      let rowsList: DealProductList[] = [];
      for(let i=0; i< this.rowData.length; i++) {
        if(this.rowData[i].productName && this.rowData[i].id) {
          if (this.rowData[i].quantity) {
            let productRow = new DealProductList;
            productRow.OWNER_ID = dealId.toString();
            productRow.PRODUCT_ID = this.rowData[i].id;
            productRow.PRODUCT_NAME = this.rowData[i].productName;
            productRow.ORIGINAL_PRODUCT_NAME = this.rowData[i].productName;
            productRow.PRODUCT_DESCRIPTION = this.rowData[i].productName;
            productRow.PRICE = this.rowData[i].RRP;
            productRow.QUANTITY = this.rowData[i].quantity;
            productRow.DISCOUNT_RATE= this.rowData[i].discount;
            productRow.TAX_INCLUDED = this.rowData[i].VAT_INCLUDED;
            productRow.TAX_RATE = this.rowData[i].tax_rate;
            productRow.OWNER_TYPE = 'D';
            productRow.STORE_ID = this.createDealForm.get("storesOptions").value;
            //productRow.WAREHOUSE_ID = this.warehouseSelection();
            //alert(this.createDealForm.get("storesOptions").value);
            //alert(productRow.WAREHOUSE_ID.toString());
            console.log(productRow);
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
        this.bitrixstockservice.bitrixProductList = data;
        console.log(this.productNamesList);
        this.createColumnsDefinition();
      });

      this.bitrixstockservice.loadBitrixPipline().subscribe((data: any) => {
        this.bitrixPipelineList = data;
        this.bitrixstockservice.bitrixPipeLine = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixCustomers().subscribe((data: any) => {
        this.bitrixCustomers = data;
        this.bitrixstockservice.bitrixCustomers = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixStoress().subscribe((data: any) => {
        this.bitrixStores = data;
        this.bitrixstockservice.bitrixStores = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixStock().subscribe((data: any) => {
        this.bitrixStoreProducts = data;
        this.bitrixstockservice.bitrixStockList = data;
        console.log(data);
      });

      this.bitrixstockservice.loadBitrixOverallStock().subscribe((data: any) => {
        this.bitrixOverAllStock = data;
        this.bitrixstockservice.bitrixOverAllStock = data;
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
        cellStyle: {border: '1px solid #c1c6c7ff' }, cellDataType: 'number'},
       { headerName: 'Price', field: 'RRP', sortable: true, resizable: true, filter: true, editable: true, width:100,
          cellStyle: {border: '1px solid #c1c6c7ff' }, cellDataType: 'number'}, 
       { headerName: 'Tax Incl', field: 'VAT_INCLUDED', sortable: true, resizable: true, filter: true, editable: true, width:100,
          cellStyle: {backgroundColor: '#ecf1f2ff', border: '1px solid #c1c6c7ff' }},
       { headerName: 'Disc %', field: 'discount', sortable: true, resizable: true, filter: true, editable: true,width:100,
          cellStyle: {border: '1px solid #c1c6c7ff' }, cellDataType: 'number' },
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
      let filterList : BitrixProducts[];
      const selectedData = this.agGrid.api.getSelectedRows();
      if(selectedData.length === 0){
        alert("No rows selected");
        return;
      }

      this.rowData = this.rowData.filter(
        row => !selectedData.some(sel => sel.productName === row.productName && sel.id === row.id)
      );
      
      //alert("selectedData = " +selectedData.length);
        const res = this.agGrid.api.applyTransaction({ remove: selectedData });
         console.log(res.remove);
         res.remove.forEach( x => {
          console.log(x);
          filterList = this.rowData.filter((item: any) => !item.productName.includes(x.data["productName"]));        
          //this.rowData = this.rowData.filter((item: any) => !item.productName.includes(x.data["productName"]));        
          //this.finalTotal = this.finalTotal - this.rowData[x].total.value;
      });
      console.log(filterList);     
      
     
       this.rowData = filterList;
       
      this.agGrid.api.setGridOption('rowData', this.rowData);
      this.GetTotals();
      this.listcount = this.rowData.length;
      this.numberOfRows = this.listcount.toString() + " Products";
    }

 
    onCellValueChanged(event: any) {
      var fetchDealNum = this.createDealForm.get("updateDealnum").value;
          if( fetchDealNum == ""){
            this.isLoading = false;
          }
          else
          {
            this.isLoading = true;
          }
      // Access the changed row data and column details
      console.log('Cell value changed:', event.data, event.colDef.field, event.newValue);
      this.storeId = this.createDealForm.get('storesOptions').value;
      // Perform actions based on the new value
      if (event.colDef.field === 'productName') {
          const rowId = event.rowIndex;
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
          
          this.listcount = this.rowData.length;
          this.numberOfRows = this.listcount.toString() + " Products";   
      } 
      else if ( event.colDef.field === 'quantity') {
        const rowId = event.rowIndex;
       
        this.rowData[rowId].total = this.rowData[rowId].quantity * this.rowData[rowId].RRP;
        this.agGrid.api.setGridOption('rowData', this.rowData);
        
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
    //this.finalTotal= totalcost.toFixed(2).toString(); // CHANGED HERE
    this.calGST = gstTotal.toFixed(2).toString();
    this.finalTotal = subTotal.toFixed(2).toString();
    //this.ftotal = subTotal.toFixed(2).toString();
  
    this.ftotal = totalcost.toFixed(2).toString();
  }


  warehouseSet(){
    if(this.createDealForm.get("pipelineOptions").value == "0"){
    this.createDealForm.get("storesOptions").setValue(1); 
    }
    if(this.createDealForm.get("pipelineOptions").value == "12"){
      this.createDealForm.get("storesOptions").setValue(8);
    }
  }

  warehouseCheck() {
  alert(this.createDealForm.get("storesOptions").value);
  // alert(this.createDealForm.get("pipelineOptions").value);
   }


  validateCustomer() {
    if(this.createDealForm.get("customersOptions").value === "")
     {
      this.customerSelect = false;
     }
     else{
      this.customerSelect = true;
     }     
}

 
  onresetForm(){
    this.createDealForm.reset();
    this.rowData = [];
    this.rowData.push(new BitrixProducts);
    this.agGrid.api.setGridOption('rowData', this.rowData);
    this.finalTotal = '';
    this.ftotal = '';
    this.calGST = '';
    this.dealNum = '';
    this.customerSelect = false;
    this.isCustomerInvalid = false;
    this.errorDisplayMsg = '';
    this.isLoading = true;
    this.isDealFetched = false;
    this.numberOfRows = '';
    console.log("Reset Button clicked!");
    //this.createDealForm.get(" pipelineOptions").setValue('0');
    //this.createDealForm.get("customersOptions").setValue('0');
    //this.createDealForm.get("storesOptions").setValue('0');
  }


  onDealAction(){
    var updatedealnumber:string = '';
    updatedealnumber = this.createDealForm.get('updateDealnum').value;

      if(updatedealnumber !=""){
       // alert("Fetching Data");
       this.isLoading = true;
        this.onUpdateDeal();
        this.isDealFetched = true;    
        this.updatDealDisable = false;
      }
      else{
        alert("Please enter the deal number to be fetched");
      }
   
  }

  onUpdateDealData(){
    this.updateDealRows();
      this.isDealFetched = false;

  }


 onUpdateDeal(){
    const updatedealnumber = this.createDealForm.get('updateDealnum').value.toString();
    console.log(updatedealnumber);
   // alert(updatedealnumber);    

    this.rowData = [];

    this.bitrixstockservice.loadDealHeader(updatedealnumber).subscribe((data: any) => {    
    console.log(data.result);  
    this.dealHeader = data.result;
       
    if (this.dealHeader) {
      console.log(this.dealHeader);
      this.dealNum = "Deal ID : " + this.dealHeader.ID.toString();
      this.createDealForm.get("dealName").setValue(this.dealHeader.TITLE);
      this.createDealForm.get("customersOptions").setValue(this.dealHeader.COMPANY_ID);
      //alert("Company Id : " +this.dealHeader.COMPANY_ID);
      this.getProductDetailsForUpdate(this.dealHeader);   
      this.fetchDealId = this.dealHeader.ID;
      }
  });
  }
  
  getProductDetailsForUpdate(dealHeader: DealHeaderModel) {
    this.bitrixstockservice.getProductDetails(dealHeader).subscribe((data: any) => {
      console.log(data);
      console.log(data.result);
      if(data){
        this.GetProductRowsForUpdate(data.result);
        
       this.agGrid.api.setGridOption('rowData', this.rowData);
       this.listcount = this.rowData.length;
       this.numberOfRows = this.listcount.toString() + " Products";
       
      }
    }
    , error => {
      console.error('Error fetching product details:', error);
  });
}

  private GetProductRowsForUpdate(data: DealProductList[]) {
    let rowsList: BitrixProducts[] = [];
    for (let i = 0; i < data.length; i++) {
          let productRow = new BitrixProducts;
         var filterRow = this.bitrixstockservice.bitrixProductList.filter(x => x.id == data[i].PRODUCT_ID)[0].PREVIEW_PICTURE;
           
          productRow.productName = data[i].PRODUCT_NAME;
          productRow.PREVIEW_PICTURE= this.bitrixstockservice.bitrixProductList.filter(x => x.id == data[i].PRODUCT_ID)[0].PREVIEW_PICTURE;
          productRow.id = data[i].PRODUCT_ID;
          productRow.RRP = data[i].PRICE;
          productRow.quantity = data[i].QUANTITY;
          productRow.discount = data[i].DISCOUNT_RATE;
          productRow.VAT_INCLUDED = data[i].TAX_INCLUDED;
          productRow.tax_rate = data[i].TAX_RATE;
          
          var stockAvail = this.bitrixOverAllStock.filter(x => x.productId == data[i].PRODUCT_ID)[0];
          console.log(stockAvail.overallQuantity);
          console.log(stockAvail);
          
          productRow.stock = stockAvail.overallQuantity;
          productRow.reserved = stockAvail.overallreserved;
          productRow.total = productRow.RRP * productRow.quantity;

          this.rowData.push(productRow);
        }
        console.log(this.rowData); 
        this.GetTotals();
        //this.isCustomerDiabled = true;
  }

  updateDealRows(){
   this.errorDisplayMsg = '';
    if (!this.IsQuantityEntered())
    {
        this.errorDisplayMsg  = 'Please enter quantity!';
        return;
    }   
    let dealHeader = new DealHeaderModel;
    dealHeader.TITLE = this.createDealForm.get("dealName").value;
    dealHeader.TYPE_ID = "SALE";
    dealHeader.COMPANY_ID =  this.createDealForm.get("customersOptions").value;
    //dealHeader.CATEGORY_ID = 
    dealHeader.OPPORTUNITY = +this.ftotal;
    dealHeader.ASSIGNED_BY_ID = '1';
    //dealHeader.STAGE_ID = 'NEW';

    dealHeader.COMMENTS = 'This deal was updated automatically via the Angular application.';
    console.log(dealHeader);
    let dealUpdateModel = new DealHeaderUpdateModel;
    dealUpdateModel.id = this.fetchDealId;
    dealUpdateModel.fields = dealHeader;
    this.bitrixstockservice.updateDealHeader(this.fetchDealId, dealUpdateModel).subscribe(
      response => {
        console.log('POST request successful:', response);
        const deal_id = response.result;
        //alert("Deal id = " + deal_id);
        console.log(deal_id);
        this.dealNum = "  Deal ID : " + this.fetchDealId.toString();

        // Process the response data here
        let dealProducts = new DealProductsRows;
        dealProducts.id = this.fetchDealId;
        let dealProductList = this.GetProductRowsList(this.fetchDealId);
        dealProducts.rows = dealProductList;
        console.log(dealProducts);
        this.bitrixstockservice.updateDealProductRows(dealProducts).subscribe(
          response => {
            console.log('POST request successful:', response);
            this.agGrid.api.setGridOption('rowData', this.rowData);
            alert('Deal Updated Successfully');
            
          },
          error => {
            alert('Error Updating deal : '+ (error?.message || JSON.stringify(error)));
          }
        );
      },
      error => {
        alert('Error Updating deal products :'+ (error?.message || JSON.stringify(error)));
      }
    );
   //this.isCustomerDiabled = true;
    //alert("Customer Disabled");
  }

  onExport(): void {
    this.agGrid.api.exportDataAsExcel();
  }

  // loadMoreUpdateProducts(pageNumber: number, totalPages: number,dealNumber: number) {
  //   this.bitrixstockservice.getProductDetails(dealNumber).subscribe((data: any) => {
  //     for (let i = 0; i < data.result.length; i++)
  //       this.rowData!.push(data.result[i]);
  //     if (data.next)
  //       this.startPage = data.next;
  //       console.log(data.result);
  //       console.log(this.rowData!);
  //     if (!data.next) {
  //       this.GetProductRowsForUpdate(data);
  //     } else {
  //       pageNumber++;
  //       this.loadMoreUpdateProducts(pageNumber, totalPages, dealNumber);
  //     }
  //   });
  // }
}
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { InvoiceLoaderService } from 'src/app/theme/shared/service/invoice-loader.service';
import { SmartInvoiceModel } from '../models/SmartInvoiceModel';

@Component({
  selector: 'app-invoicedownload',
  imports: [FormsModule, ReactiveFormsModule, AgGridAngular],
  templateUrl: './invoicedownload.component.html',
  styleUrl: './invoicedownload.component.scss'
})
export class InvoicedownloadComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  invoiceDownloadForm: FormGroup;
  startPage!: string;
  logoUrl: string = '';
  isLoading: boolean = false;
  invoiceTotal: number = 0;
  invoiceTaxTotal: number = 0;
  rowData?: SmartInvoiceModel[];
  productRowData?: Partial<SmartInvoiceModel>[];
  emptyRowData: Partial<SmartInvoiceModel> = {};

  // // Column Definitions: Defines & controls grid columns.
  colDefs: any = [
    { field: 'id', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
    { headerName: 'Voucher Date', field: 'begindate', sortable: true, resizable: true, filter: true },
    { headerName: 'Voucher Number', field: 'accountNumber', sortable: true, resizable: true, filter: true },
    { headerName: 'Ledger Name', field: 'ledgerName', sortable: true, resizable: true, filter: true },
    { headerName: 'Ledger Amount', field: 'ledgerAmount', sortable: true, resizable: true, filter: true },
    { headerName: 'Voucher Type Name', field: 'voucherTypeName', sortable: true, resizable: true, filter: true },
    { headerName: 'Ledger Amount Dr/Cr', field: 'debitCredit', sortable: true, resizable: true, filter: true },
    { headerName: 'Change Mode', field: 'changeMode', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - GSTIN/UIN', field: 'buyeGstin', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - Address', field: 'buyerAddress', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - State', field: 'buyerState', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - Pincode', field: 'buyerPostalCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - GST Registration Type', field: 'buyerState', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - Place of Supply', field: 'buyerState', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - Country', field: 'buyerCountry', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - Address', field: 'consigneeAddress', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - State', field: 'consigneeState', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - Pincode', field: 'consigneePostalCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee -  GSTIN/UIN', field: 'consigneeGstin', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Name', field: 'PRODUCT_NAME', sortable: true, resizable: true, filter: true },
    { headerName: 'HSN/SAC', field: 'productHSNCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Billed Quantity', field: 'QUANTITY', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Rate', field: 'PRICE_NETTO', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Rate per', field: 'MEASURE_NAME', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Amount', field: 'itemAmount', sortable: true, resizable: true, filter: true, cellDataType: 'number' },
    { headerName: 'GST Registration', field: 'city', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From Address', field: 'sellerAddress', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From Name', field: 'sellerName', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From State', field: 'sellerState', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From Pincode', field: 'sellerPostalCode', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Bill to place', field: 'city', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Ship to place', field: 'consigneeAddress', sortable: true, resizable: true, filter: true }
  ];

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private invoiceLoaderService: InvoiceLoaderService) {
    this.invoiceDownloadForm = this.formBuilder.group({
      invoiceNumber: ['', [Validators.required]]
    });
  }
  ;

  ngOnInit(): void {

  }

  onSubmit(): void {
    if(this.invoiceDownloadForm.invalid) {
      alert('Please enter required values');
      return;
    }
    this.isLoading = true;
    this.productRowData = [];
    this.rowData = [];
    //this.productRowData.push(this.emptyRowData);
    //this.productRowData.push(this.emptyRowData);
    this.agGrid.api.setGridOption('loading', true);
    
    this.invoiceLoaderService.loadInvoiceHeader(this.invoiceDownloadForm.get('invoiceNumber')?.value).subscribe((data: any) => {
      this.rowData = [data.result.item];
      if (this.rowData) {
        this.getBuyerdetails(this.rowData[0].companyId);
        this.getBuyerAddressdetails(this.rowData[0].companyId);
        this.getSellerAddressdetails(this.rowData[0].mycompanyId);
        this.getBuyToShipToGST(this.rowData[0].companyId);
        this.loadProducts();
      }

      console.log(this.productRowData);
    });

  }

  getBuyerdetails(buyerId: number): void {
    this.invoiceLoaderService.getCompanyDetails(buyerId).subscribe((data: any) => {
      if (this.rowData && data) {
        this.rowData[0].ledgerName = data.result.TITLE;
        this.rowData[0].voucherTypeName = 'Sales';
        this.rowData[0].debitCredit = 'Dr';
        this.rowData[0].changeMode = 'Item Invoice';
        if(!this.rowData[0].buyeGstin)
          this.rowData[0].buyeGstin = data.result.UF_CRM_1669549072;
      }
    });

  }

  getBuyToShipToGST(companyId: number) {
    this.invoiceLoaderService.loadBuyToShipToGST(companyId).subscribe((data: any) => {
      if (this.rowData && data) {
        if(!this.rowData[0].buyeGstin)
          this.rowData[0].buyeGstin = data.result[0].UF_CRM_1656060255;
        this.rowData[0].consigneeGstin = data.result[0].UF_CRM_1672887232;
      }
    });
  }
  getBuyerAddressdetails(buyerId: number): void {
    if (buyerId > 0) {
      this.invoiceLoaderService.getCompanyAddressDetails(buyerId).subscribe((data: any) => {
        if (this.rowData && data) {
          let buyerAddressDetails = data.result.filter((item: any) => item.TYPE_ID.includes(4));
          if (buyerAddressDetails.length > 0) {
            //if(buyerAddressDetails[0].ADDRESS_1) { this.rowData[0].buyerAddress = buyerAddressDetails[0].ADDRESS_1 ?? ''};
            //if(buyerAddressDetails[0].ADDRESS_2) { this.rowData[0].buyerAddress += buyerAddressDetails[0].ADDRESS_2 ?? ''};
            this.rowData[0].buyerAddress = buyerAddressDetails[0].ADDRESS_1 ?? '' + buyerAddressDetails[0].ADDRESS_2 ?? ''
            //this.rowData[0].buyerAddress =  buyerAddressDetails[0].ADDRESS_1 ?? '';
            // this.rowData[0].buyerAddress +=  buyerAddressDetails[0].ADDRESS_2 ?? '';
            this.rowData[0].buyerPostalCode = buyerAddressDetails[0].POSTAL_CODE ?? '';
            this.rowData[0].buyerState = buyerAddressDetails[0].PROVINCE ?? '';
            this.rowData[0].buyerCountry = buyerAddressDetails[0].COUNTRY ?? 'India';
          }
          let consigneeAddressDetails = data.result.filter((item: any) => item.TYPE_ID.includes(11));
          if (consigneeAddressDetails.length > 0) {
            this.rowData[0].consigneeAddress = consigneeAddressDetails[0].ADDRESS_1 ?? '' + consigneeAddressDetails[0].ADDRESS_2 ?? '';
            //this.rowData[0].consigneeAddress =  consigneeAddressDetails[0].ADDRESS_1 ?? '';
            //this.rowData[0].consigneeAddress +=  consigneeAddressDetails[0].ADDRESS_2 ?? '';
            this.rowData[0].consigneePostalCode = consigneeAddressDetails[0].POSTAL_CODE ?? '';
            this.rowData[0].consigneeState = consigneeAddressDetails[0].PROVINCE ?? '';
            this.rowData[0].consigneeCountry = consigneeAddressDetails[0].COUNTRY ?? 'India';
          }
        }
      });
    }
  }

  getSellerAddressdetails(sellerId: number): void {
    this.invoiceLoaderService.getCompanyAddressDetails(sellerId).subscribe((data: any) => {
      if (this.rowData && data) {
        this.rowData[0].sellerName = 'Spectrus Sustainable Solutions Pvt Ltd';
        let sellerAddressDetails = data.result.filter((item: any) => item.TYPE_ID.includes(4));
        if (sellerAddressDetails.length > 0) {
          if (sellerAddressDetails[0].ADDRESS_1) { this.rowData[0].sellerAddress = sellerAddressDetails[0].ADDRESS_1 };
          if (sellerAddressDetails[0].ADDRESS_2) { this.rowData[0].sellerAddress += sellerAddressDetails[0].ADDRESS_2 };
          this.rowData[0].sellerPostalCode = sellerAddressDetails[0].POSTAL_CODE ?? '560098';
          this.rowData[0].sellerState = sellerAddressDetails[0].PROVINCE ?? 'Karnataka';
        }
      }
    });
  }

  loadProducts(): void {
    this.invoiceTotal = 0;
    this.invoiceLoaderService.loadProductRow(this.invoiceDownloadForm.get('invoiceNumber')?.value, '').subscribe((data: any) => {
      this.productRowData = data.result;
      if (this.rowData && this.productRowData) {
        this.productRowData!.unshift(this.rowData![0]);
        let totalRows = data.total;
        let totalPages_pre = Number((totalRows / 50).toFixed(0));
        if (data.next)
          this.startPage = data.next;
        if (totalPages_pre == 0 || totalRows <= 50) {
         
          this.loadProductDetails(1, 1);

        }
        if (totalPages_pre > 0 && totalRows > 50)
          this.loadMoreProducts(2, totalPages_pre);
      }
    });
  }
  loadMoreProducts(pageNumber: number, totalPages: number) {
    this.invoiceLoaderService.loadProductRow(this.invoiceDownloadForm.get('invoiceNumber')?.value, this.startPage).subscribe((data: any) => {
      for (let i = 0; i < data.result.length; i++)
        this.productRowData!.push(data.result[i]);
      if (data.next)
        this.startPage = data.next;
      console.log(data.result);
      console.log(this.productRowData);
      if (!data.next) {
        
        this.loadProductDetails(pageNumber, totalPages);
      } else {
        pageNumber++;
        this.loadMoreProducts(pageNumber, totalPages);
      }
    });
  }

  loadProductDetails(pageNumber: number, totalPages: number) {
    this.invoiceTotal = 0;

    for (let i = 1; i < this.productRowData!.length; i++) {
      if (this.productRowData![i].PRODUCT_ID) {
        this.invoiceLoaderService.getProductHSNCode(this.productRowData![i].PRODUCT_ID!).subscribe((data: any) => {
          if(data.result.product.property112)
            this.productRowData![i].productHSNCode = data.result.product.property112.value;

          if (i === (this.productRowData!.length - 1)) {
            this.productRowData.push(Object.assign({}, this.emptyRowData));
            this.productRowData.push(Object.assign({}, this.emptyRowData));
            this.calculateInvoiceAmounts();
            return;
          }

        });
      } else {
        if (pageNumber === totalPages && (i === (this.productRowData!.length - 1))) {
          this.productRowData.push(Object.assign({}, this.emptyRowData));
          this.productRowData.push(Object.assign({}, this.emptyRowData));
          this.calculateInvoiceAmounts();
          return;
        }
      }
    }
  }

  Dec2(num) {
    num = String(num);
    if(num.indexOf('.') !== -1) {
      var numarr = num.split(".");
      if (numarr.length == 1) {
        return Number(num);
      }
      else {
        return Number(numarr[0]+"."+numarr[1].charAt(0)+numarr[1].charAt(1));
      }
    }
    else {
      return Number(num);
    }  
  }

  calculateInvoiceAmounts(): void {
    this.invoiceTotal = 0;
    this.invoiceTaxTotal = 0;
    for (let i = 1; i < this.productRowData!.length; i++) {
      if (!isNaN(this.productRowData![i].QUANTITY!)) {
        let taxRate = (this.productRowData![i].TAX_RATE / 100) + 1!;
        this.invoiceTaxTotal += this.productRowData![i].QUANTITY! * this.productRowData![i].PRICE_EXCLUSIVE! * this.productRowData![i].TAX_RATE / 100;
        this.productRowData![i].itemAmount = Number((this.productRowData![i].QUANTITY! * this.productRowData![i].PRICE! / taxRate ).toFixed(2));
        this.invoiceTotal += (this.productRowData![i].itemAmount === undefined ? 0 : this.productRowData![i].itemAmount)
      }
    }
    console.log('called');
    this.invoiceTotal = Number(this.invoiceTotal.toFixed(2));
    this.invoiceTaxTotal = Number(this.invoiceTaxTotal.toFixed(2));
    const lastIndex = this.productRowData.length;
    let gstTaxInterState = this.invoiceTaxTotal;
    let gstTaxLocal = gstTaxInterState / 2;
    this.productRowData![0].ledgerAmount = this.invoiceTotal + this.invoiceTaxTotal;
    this.productRowData![1].ledgerAmount = this.invoiceTotal;
    if (this.productRowData![0].buyeGstin && this.productRowData![0].buyeGstin?.startsWith('29')) {
      this.productRowData[1].ledgerName = 'Local Sales Product B2B';
      
      this.productRowData[lastIndex - 2].ledgerName = 'Output CGST @ 9%';
      this.productRowData[lastIndex - 1].ledgerName = 'Output SGST @ 9%';
      this.productRowData[this.productRowData.length - 1].ledgerAmount = gstTaxLocal;
      this.productRowData[this.productRowData.length - 2].ledgerAmount = gstTaxLocal;
      this.productRowData![this.productRowData.length - 2].debitCredit = 'Cr';
      this.productRowData![this.productRowData.length - 1].debitCredit = 'Cr';
    }
    else {
      this.productRowData![1].ledgerName = 'Interstate Sales Product B2B';
      this.productRowData![this.productRowData!.length - 2].ledgerName = 'Output IGST @ 18%';
      this.productRowData![this.productRowData!.length - 2].ledgerAmount = gstTaxInterState;
      this.productRowData![this.productRowData!.length - 2].debitCredit = 'Cr';
    }
    this.productRowData![1].debitCredit = 'Cr';
    

    this.productRowData![0].begindate = this.datePipe.transform(this.productRowData![0].begindate, "dd-MM-yyyy")?.toString() ?? '';
    this.agGrid.api.setGridOption('rowData', this.productRowData);
    this.isLoading = false;
    this.agGrid.api.setGridOption('loading', false);
    
  }

  onExport(): void {
    this.agGrid.api.exportDataAsExcel();
  }

}

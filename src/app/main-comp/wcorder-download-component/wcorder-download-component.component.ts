import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';

import { CommonModule, DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { WooCommOrderLoaderService } from 'src/app/theme/shared/service/wooCommOrder-loader.service';
import { WooCommOrderModel } from '../models/WooCommOrderModel';
import { BehaviorSubject, interval, map, of, pipe, Subject, Subscription, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-wcorder-download-component',
  imports: [FormsModule, ReactiveFormsModule, AgGridAngular, NgbDatepickerModule, FormsModule, CommonModule],
  templateUrl: './wcorder-download-component.component.html',
  styleUrl: './wcorder-download-component.component.scss'
})
export class WCOrderDownloadComponent implements OnDestroy, OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  @Input() name!: string;
  wCOrderDownloadForm: FormGroup;
  logoUrl: string = '';
  start!: Date;
  end!: Date;
  rowDisplayData!: Partial<WooCommOrderModel>[];
  tempRowData: Partial<WooCommOrderModel>[] = [];
  selectedOption!: string;
  isLoading: boolean = false;
  currentPageNumber: number = 1;


  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  page = {
    count: 0
  }
  indian_states = [
    { "id": "AN", "value": "Andaman and Nicobar Islands" },
    { "id": "AP", "value": "Andhra Pradesh" },
    { "id": "AR", "value": "Arunachal Pradesh" },
    { "id": "AS", "value": "Assam" },
    { "id": "BR", "value": "Bihar" },
    { "id": "CG", "value": "Chandigarh" },
    { "id": "CH", "value": "Chhattisgarh" },
    { "id": "DN", "value": "Dadra and Nagar Haveli" },
    { "id": "DD", "value": "Daman and Diu" },
    { "id": "DL", "value": "Delhi" },
    { "id": "GA", "value": "Goa" },
    { "id": "GJ", "value": "Gujarat" },
    { "id": "HR", "value": "Haryana" },
    { "id": "HP", "value": "Himachal Pradesh" },
    { "id": "JK", "value": "Jammu and Kashmir" },
    { "id": "JH", "value": "Jharkhand" },
    { "id": "KA", "value": "Karnataka" },
    { "id": "KL", "value": "Kerala" },
    { "id": "LA", "value": "Ladakh" },
    { "id": "LD", "value": "Lakshadweep" },
    { "id": "MP", "value": "Madhya Pradesh" },
    { "id": "MH", "value": "Maharashtra" },
    { "id": "MN", "value": "Manipur" },
    { "id": "ML", "value": "Meghalaya" },
    { "id": "MZ", "value": "Mizoram" },
    { "id": "NL", "value": "Nagaland" },
    { "id": "OR", "value": "Odisha" },
    { "id": "PY", "value": "Puducherry" },
    { "id": "PB", "value": "Punjab" },
    { "id": "RJ", "value": "Rajasthan" },
    { "id": "SK", "value": "Sikkim" },
    { "id": "TN", "value": "Tamil Nadu" },
    { "id": "TS", "value": "Telangana" },
    { "id": "TR", "value": "Tripura" },
    { "id": "UP", "value": "Uttar Pradesh" },
    { "id": "UK", "value": "Uttarakhand" },
    { "id": "WB", "value": "West Bengal" }
  ];

  options = [
    { name: "Completed", value: "completed" },
    { name: "Cancelled", value: "cancelled" }
  ]

  invoiceTotal: number = 0;
  invoiceTaxTotal: number = 0;
  discountTotal: number = 0;
  productRowData?: WooCommOrderModel[] = [];
  emptyRowData: Partial<WooCommOrderModel> = {};
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    selectedOption: new FormControl<string | null>(null)
  });


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
    { headerName: 'Buyer/Supplier - GST Registration Type', field: 'buyerGSTRegistration', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - Place of Supply', field: 'buyerState', sortable: true, resizable: true, filter: true },
    { headerName: 'Buyer/Supplier - Country', field: 'buyerCountry', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - Address', field: 'consigneeAddress', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - State', field: 'consigneeState', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - Pincode', field: 'consigneePostalCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Consignee - Country', field: 'consigneeCountry', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Name', field: 'PRODUCT_NAME', sortable: true, resizable: true, filter: true },
    { headerName: 'HSN/SAC', field: 'productHSNCode', sortable: true, resizable: true, filter: true },
    { headerName: 'Billed Quantity', field: 'QUANTITY', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Rate', field: 'PRICE_EXCLUSIVE', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Rate per', field: 'MEASURE_NAME', sortable: true, resizable: true, filter: true },
    { headerName: 'Item Amount', field: 'itemAmount', sortable: true, resizable: true, filter: true },
    { headerName: 'GST Registration', field: 'gstRegistration', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From Address', field: 'sellerAddress', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From Name', field: 'sellerName', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From State', field: 'sellerState', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Dispatch From Pincode', field: 'sellerPostalCode', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Bill to place', field: 'city', sortable: true, resizable: true, filter: true },
    { headerName: 'e-Invoice - Ship to place', field: 'consigneeAddress', sortable: true, resizable: true, filter: true }
  ];

  constructor(private formBuilder: FormBuilder, private wooCommOrderLoaderService: WooCommOrderLoaderService,
    private datePipe: DatePipe) {
    this.wCOrderDownloadForm = this.formBuilder.group({
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]],
      selectedOption: ['', [Validators.required]]
    });
  }
  ;


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ngOnInit(): void {

  }

  clearGridData() {
    this.tempRowData = [];
    this.productRowData = [];
    this.emptyRowData = {};
  }

  onSubmit(): void {
    if (this.rowDisplayData)
      this.rowDisplayData.length = 0;
    this.agGrid.api.setGridOption('loading', true);
    this.clearGridData();
    this.selectedOption = this.wCOrderDownloadForm.get('selectedOption')?.value;

    this.start = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
    this.end = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
    console.log(this.start);
    console.log(this.end);
    if (!(this.selectedOption && this.start && this.end)) {
      alert('Please enter date and status')
      return;
    }

    this.isLoading = true;
    this.agGrid.api.setGridOption('loading', true);
    let totalPages_pre = 0;
    this.wooCommOrderLoaderService.loadInvoiceHeader(this.datePipe.transform(this.start, "yyyy-MM-dd")?.toString() ?? '', this.datePipe.transform(this.end, "yyyy-MM-dd")?.toString() ?? '', 1, this.selectedOption).subscribe((data: any) => {
      if (data) {
        let total_pages = data.headers.get('X-WP-TotalPages');
        this.page.count = Number(total_pages);
        this.rowDisplayData = this.loadOrdersFormatted(data.body);
        this.loadHSNForProducts();

      }
    });

    // ((data: any) => {

    //   if (data) {
    //     let totalRows = data.headers.get('X-WP-TotalPages');
    //     let totalPages_pre = Number((totalRows / 100).toFixed(0));

    //     this.rowDisplayData = this.loadOrdersFormatted(data.body);
    //     if (totalPages_pre == 0 || totalRows <= 100) {
    //       this.loadHSNForProducts();
    //       this.agGrid.api.setGridOption('rowData', this.rowDisplayData);
    //       this.agGrid.api.setGridOption('loading', false);
    //     } else {
    //       this.agGrid.api.setGridOption('pagination', true);
    //     }

    //     for (let h = 2; h <= totalPages_pre; h++) {
    //       this.agGrid.api.setGridOption('loading', true);
    //       this.loadOrdersNextPages(h, totalPages_pre);
    //     }

    //   }
    //   console.log(this.rowDisplayData);
    // });

  }

  loadOnPageIndexChange(pageNumber: number) {
    this.clearGridData();
    this.wooCommOrderLoaderService.loadInvoiceHeader(this.datePipe.transform(this.start, "yyyy-MM-dd")?.toString() ?? '', this.datePipe.transform(this.end, "yyyy-MM-dd")?.toString() ?? '', pageNumber, this.selectedOption).subscribe((res: any) => {
      this.rowDisplayData = this.loadOrdersFormatted(res.body);
      this.loadHSNForProducts();
    });

  }

  onPageNumberClick(pageNumber: number) {
    this.agGrid.api.setGridOption('loading', true);
    this.loadOnPageIndexChange(pageNumber);
    this.currentPageNumber = pageNumber;
  }

  onPrevNextClick(prevNext: number) {
    if ((this.currentPageNumber == 1 && prevNext < 0) || (this.currentPageNumber == this.page.count)) {
      return;
    }
    this.currentPageNumber = this.currentPageNumber + prevNext;
    this.agGrid.api.setGridOption('loading', true);
    this.loadOnPageIndexChange(this.currentPageNumber);
  }
  loadOrdersNextPages(pageNumber: number, totalPages: number): void {
    this.wooCommOrderLoaderService.loadInvoiceHeader(this.datePipe.transform(this.start, "yyyy-MM-dd")?.toString() ?? '', this.datePipe.transform(this.end, "yyyy-MM-dd")?.toString() ?? '', pageNumber, this.selectedOption).subscribe((data: any) => {

      if (data) {

        this.rowDisplayData = this.loadOrdersFormatted(data.body);
        this.loadHSNForProducts();

      }
      console.log(this.rowDisplayData);
    });

  }


  endDateEvent(event: any) {
    this.end = event.target.value;
  }

  startDateEvent(event: any) {
    this.start = event.target.value;
  }
  loadOrdersFormatted(resData: any) {
    for (let i = 0; i < resData.length; i++) {
      this.discountTotal = 0;
      let orderItem = this.getOrderItem(i, resData[i]);
      this.tempRowData.push(orderItem);
      let productItemsRes = this.getProductLineItems(i, resData[i].line_items);
      resData[i].discountTotal = resData[i].coupon_lines.discount - resData[i].coupon_lines.discount_tax;
      let blankRowItem: Partial<WooCommOrderModel> = {};
      let blankRowItem1: Partial<WooCommOrderModel> = {};
      this.calculateInvoiceAmounts(orderItem, productItemsRes, blankRowItem, blankRowItem1);
      for (let k = 0; k < productItemsRes.length; k++) {
        this.tempRowData.push(productItemsRes[k]);
      }
      this.tempRowData.push(blankRowItem);
      this.tempRowData.push(blankRowItem1);
      this.tempRowData.push(Object.assign({}, this.emptyRowData));
    }
    return this.tempRowData;
  }


  getOrderItem(index: number, item: any) {
    let orderItem: Partial<WooCommOrderModel> = {
      id: item.id,
      ledgerName: 'Online Sales_EHA',//item.billing.first_name + ' ' + item.billing.last_name,
      accountNumber: item.meta_data.find((x: any) => x.key.includes('_wcpdf_invoice_number_data')) === undefined ? '' : item.meta_data.find((x: any) => x.key.includes('_wcpdf_invoice_number_data')).value.number,
      assignedById: '',
      begindate: item.date_created,
      categoryId: '',
      companyId: 0,
      voucherTypeName: 'Eha Sale',
      debitCredit: 'Dr',
      changeMode: 'Item Invoice',
      buyeGstin: '',
      buyerAddress: item.billing.first_name + ' ' + item.billing.last_name + ' ' + item.billing.address_1 + item.billing.address_2,
      buyerState: this.indian_states.find((x: any) => x.id.includes(item.billing.state))?.value,
      buyerPostalCode: item.billing.postcode,
      buyerCountry: item.billing.country === 'IN' ? 'INDIA' : item.billing.country,
      consigneeAddress: item.shipping.address_1 + item.shipping.address_2,
      consigneeState: this.indian_states.find((x: any) => x.id.includes(item.shipping.state))?.value,
      consigneePostalCode: item.shipping.postcode,
      consigneeCountry: item.shipping.country === 'IN' ? 'INDIA' : item.shipping.country,
      sellerAddress: 'No. 1026, 1st Floor, 2nd Cross St, BEML Layout, 5th Stage, RR Nagar, Bengaluru',// item.find((key: any) :> {return key.id.includes(986905)})[0].value.shop_address.default,
      sellerState: 'Karnataka',//item.find((key: any) :> {return key.id.includes(986905)})[0].value.shop_address.default,
      sellerPostalCode: '560098',//item.find((key: any) :> {return key.id.includes(986905)})[0].value.shop_address.default,
      sellerName: 'Spectrus Sustainable Solutions Pvt Ltd',//item.find((key: any) :> {return key.id.includes(986905)})[0].value.shop_name.default,
      gstRegistration: 'Karnataka Registration',
      mycompanyId: 0,
      productHSNCode: '',
      PRODUCT_ID: 0,
      buyerGSTRegistration: 'Unregistered/Consumer',
      discountAmount: Number(item.coupon_lines.reduce((a: any, b: any) => a + Number(b.discount), 0)),
      discount_tax: Number(item.coupon_lines.reduce((a: any, b: any) => a + Number(b.discount_tax), 0))
    }
    return orderItem;
  }

  getProductLineItems(index: number, productItems: any) {
    console.log(productItems);
    let productsOfOrder: any = [];
    this.invoiceTotal = 0;
    this.invoiceTaxTotal = 0;
    for (let j = 0; j < productItems.length; j++) {
      let productItem: Partial<WooCommOrderModel> = {
        PRODUCT_NAME: productItems[j].sku,
        MEASURE_NAME: 'pcs',
        QUANTITY: productItems[j].quantity,
        PRICE_EXCLUSIVE: productItems[j].price,
        productHSNCode: '',
        PRODUCT_ID: productItems[j].product_id,
        subtotal: productItems[j].subtotal,
        subtotal_tax: productItems[j].subtotal_tax,
        total_tax: productItems[j].total_tax        
      }
      productItem.itemAmount = Number(productItem.subtotal) + Number(productItem.subtotal_tax);
      console.log('itemAmount = ' + productItem.itemAmount);
      console.log('subtotal = ' + productItem.subtotal);
      console.log('subtotal_tax = ' + productItem.subtotal_tax);
      console.log('itemAmount = ' + productItem.itemAmount);
      this.invoiceTotal += Number(productItem.itemAmount);
      this.invoiceTaxTotal += Number(productItem.total_tax);
      console.log('this.invoiceTotal = ' + this.invoiceTotal);
      productsOfOrder.push(productItem);
    }
    return productsOfOrder;
  }

  loadHSNForProducts() {
    this.agGrid.api.setGridOption('loading', true);
    for (let l = 0; l < this.rowDisplayData.length; l++) {
      if (this.rowDisplayData[l].PRODUCT_ID) {
        this.wooCommOrderLoaderService.getProductHSNCode(this.rowDisplayData[l].PRODUCT_ID!).subscribe((data: any) => {
          if (data) {
            this.rowDisplayData[l].productHSNCode = data.meta_data.find((x: any) => x.key.includes('hsn_prod_id')).value;
            if (l == (this.rowDisplayData.length - 1)) {
              this.agGrid.api.setGridOption('rowData', this.rowDisplayData);
              this.agGrid.api.setGridOption('loading', false);
            }
          }
        });
      } else {
        if (l == (this.rowDisplayData.length - 1)) {
          this.agGrid.api.setGridOption('rowData', this.rowDisplayData);
          this.agGrid.api.setGridOption('loading', false);
        }
      }
    }
  }
  onExport(): void {
    this.agGrid.api.exportDataAsCsv();
  }

  calculateInvoiceAmounts(orderItem: Partial<WooCommOrderModel>, productLineItem: Partial<WooCommOrderModel>[], blankRowItem: Partial<WooCommOrderModel>, blankRowItem1: Partial<WooCommOrderModel>): void {

    console.log('discountTotal = ' + this.discountTotal)
    this.invoiceTotal = this.invoiceTotal - this.invoiceTaxTotal - orderItem.discountAmount - orderItem.discount_tax;
    console.log('Invoice total = ' + this.invoiceTotal);
    let gstTaxInterState = this.invoiceTaxTotal;//Number(((this.invoiceTotal * 18) / 100).toFixed(2));
    let gstTaxLocal = this.invoiceTaxTotal/ 2;//Number(((this.invoiceTotal * 9) / 100).toFixed(2));
    //let invoiceTotalTax = Number((this.invoiceTotal + gstTaxInterState).toFixed(2));
    orderItem!.ledgerAmount = this.invoiceTotal + this.invoiceTaxTotal;
    productLineItem![0].ledgerAmount = this.invoiceTotal ;
    //blankRowItem!.ledgerAmount = gstTaxInterState;
    if (orderItem.buyerState === orderItem.sellerState) {
      productLineItem![0].ledgerName = 'Local Sales Product B2C (EHA)';
      productLineItem![0].debitCredit = 'Cr';
      blankRowItem1.ledgerName = 'Output CGST @ 9%';
      blankRowItem.ledgerName = 'Output SGST @ 9%';
      blankRowItem.ledgerAmount = gstTaxLocal;
      blankRowItem.debitCredit = 'Cr';
      blankRowItem1.ledgerAmount = gstTaxLocal;
      blankRowItem1.debitCredit = 'Cr';
    } else {
      productLineItem![0].ledgerName = 'Interstate Sales Product B2C (EHA)';
      productLineItem![0].debitCredit = 'Cr';
      blankRowItem.ledgerName = 'Output IGST @ 18%';
      blankRowItem.ledgerAmount = gstTaxInterState;
      blankRowItem.debitCredit = ' Cr';
    }
    ///blankRowItem!.ledgerName = 'Output IGST @ 18%';
    //productLineItem![0].debitCredit = 'Cr';
    //blankRowItem!.debitCredit = ' Cr';

    orderItem!.begindate = this.datePipe.transform(orderItem!.begindate, "dd-MM-yyyy")?.toString() ?? '';
    this.isLoading = false;
    this.agGrid.api.setGridOption('loading', false);

  }

  ngOnDestroy() {

  }
}


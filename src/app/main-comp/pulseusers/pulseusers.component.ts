// angular import
import { DatePipe, CommonModule} from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { error,} from 'console';
import { BitrixStockService } from 'src/app/theme/shared/service/bitrix-stock-service';



@Component({
  selector: 'app-pulseusers',
  imports: [FormsModule, ReactiveFormsModule, AgGridAngular, CommonModule],
  standalone: true,
  templateUrl: './pulseusers.component.html',
  styleUrl: './pulseusers.component.scss'
})
  

  
export class PulseusersComponent {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  bitrixstockForm: FormGroup;
  usersData?: any;
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private bitrixstockservice: BitrixStockService) {
    this.bitrixstockForm = this.formBuilder.group({
        
    });
  };

  addUserForm!: FormGroup;
  
  colDefs: any = [
    { headerName: 'User ID', field: 'ID', sortable: true, resizable: true, filter: true, editable: false },
    { headerName: 'Name', field: 'Employee', sortable: true, resizable: true, filter: true, width: 200, editable: () => this.isEditMode },
    { headerName: 'Email', field: 'Email', sortable: true, resizable: true, filter: true, width: 250, editable: () => this.isEditMode },
    { headerName: 'Phone', field: 'Mobile', sortable: true, resizable: true, filter: true, width: 150, editable: () => this.isEditMode },
    { headerName: 'Department', field: 'Department', sortable: true, resizable: true, filter: true, width: 200, editable: () => this.isEditMode },
    { headerName: 'Position', field: 'Position', sortable: true, resizable: true, filter: true, width: 200, editable: () => this.isEditMode },
    { headerName: 'DOB', field: 'Date_of_birth', sortable: true, resizable: true, filter: true, width: 150, editable: () => this.isEditMode },
    { headerName: 'Gender', field: 'Gender', sortable: true, resizable: true, filter: true, width: 100, editable: () => this.isEditMode },
  ];
  
  ngOnInit(): void {
    this.bitrixstockservice.loadBitrixPulseUsers().subscribe((data: any) => {
      console.log(data);
      this.usersData = data;
    });
     
  }

  onExport(): void {
    this.agGrid.api.exportDataAsExcel();
  }
  isEditMode = false;

  toggleEdit() { // <-- Add this method
    this.isEditMode = !this.isEditMode;
    this.agGrid.api.refreshCells({ force: true });
  }
  onCellValueChanged(event: any) {
    const updatedUser = event.data;
    this.bitrixstockservice.updatePulseUser(updatedUser).subscribe({
      next: () => {
        // Optionally show a success message
      },
      error: () => {
        // Optionally handle error and revert change
      }
    });
  }
  showAddUserForm = false;

  toggleAddForm() {
    this.showAddUserForm = !this.showAddUserForm;
    if (this.showAddUserForm && !this.addUserForm) {
      this.initAddForm();
    }
  }

  closeAddForm() {
    this.showAddUserForm = false;
    this.addUserForm.reset();
  }

  initAddForm() {
    this.addUserForm = this.formBuilder.group({
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Mobile: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{9,15}$/)]],
    Department: ['', Validators.required],
    Position: ['', Validators.required],
    Date_of_birth: ['', Validators.required],
    Gender: ['', Validators.required]
    });
  }

  submitAddUser() {
    if (!this.addUserForm.valid) {
      return;
    }
    const formValue = this.addUserForm.value;
    const newUser = {
    ...formValue,
    Employee: `${formValue.FirstName} ${formValue.LastName}`.trim()
    // Keep FirstName and LastName in the payload
  };
    this.bitrixstockservice.addPulseUser(newUser).subscribe({
      next: () => {
        this.showAddUserForm = false;
        this.addUserForm.reset();
        // Reload users data after successful add
        this.bitrixstockservice.loadBitrixPulseUsers().subscribe((data: any) => {
          this.usersData = data;
        });
      },
      error: (err) => {
        // Optionally handle error (e.g., show a message)
        console.error('Failed to add user', err);
      }
    });
  }}

// export class BitrixstockComponent {
  

//     colDefs: any = [
//         { headerName: 'Store', field: 'storeId', sortable: true, resizable: true, filter: true },
//         { headerName: 'Image',field: 'preview_picture', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100, cellRenderer: (params) => `<img style="height: 30px; width: 30px" src=${params.data.preview_picture} />` },
//         { headerName: 'Product', field: 'productName', sortable: true, resizable: true, filter: true,width:300 },
//         { headerName: 'Available', field: 'quantity', sortable: true, resizable: true, filter: true, width:150},
//         { headerName: 'Reserved', field: 'quantityReserved', sortable: true, resizable: true, filter: true,width:150 },
//         ];

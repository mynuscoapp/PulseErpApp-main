import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-enterprise';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-custom-select-editor',
  imports: [CommonModule, FormsModule],
  template: `
    <div id="wrapper" [style.visibility]="isHidden? 'hidden': 'visible'">
    <div id="inner1">
    <input
      type="text"
      [(ngModel)]="searchText"
      (input)="onSearchChange()"
      placeholder="Search..."
    />
    </div>
    <div id="inner2">
    <select [(ngModel)]="selectedValue" (change)="onSelectChange()">
      <option *ngFor="let option of filteredOptions" [value]="option">
        {{ option }}
      </option>
    </select>
    </div>
    </div>
  `,
})
export class MyCustomSelectEditorComponent implements ICellEditorAngularComp {
  params!: ICellEditorParams;
  searchText: string = '';
  selectedValue: any;
  options: any[] = [];
  filteredOptions: any[] = [];
  isHidden: boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.options = params.values || []; // Pass values via cellEditorParams
    this.filteredOptions = [...this.options];
    this.selectedValue = params.value;
    onCellClicked: (event: any) => 
      this.isHidden = false;
    console.log(params.values);
  }

  getValue(): any {
    return this.selectedValue;
  }

  isPopup(): boolean {
    return true; // Important for popup editors
  }

  onSearchChange(): void {
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSelectChange(): void {
    this.isHidden = true;
  }
}
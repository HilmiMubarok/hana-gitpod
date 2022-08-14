import { Component } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-collateral-appraisal-comparison-data-kendaraan',
  templateUrl: './collateral-appraisal-comparison-data-kendaraan.component.html',
  styleUrls: ['./collateral-appraisal-comparison-data.css'],
})
export class CollateralAppraisalComparisonDataKendaraanComponent {
  // Initiation
  public items = [
    {
      indexNum: 1,
      brand: 'Suzuki',
      type: 'Matic',
      bidPrice: '1000.000',
      transactionPrice: '10.000',
      source: 'Tree',
      phone: '089778776567',
      titleOfPerson: 'Head',
      notes: '-',
    },
  ];
  public dialogAddVisible = false;
  public dialogEditVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Model
  public brand?: string;
  public type?: string;
  public bidPrice?: string;
  public transactionPrice?: string;
  public source?: string;
  public phone?: string;
  public titleOfPerson?: string;
  public notes?: string;

  public onEdit(data: any): void {
    this.brand = data.brand;
    this.type = data.type;
    this.bidPrice = data.bidPrice;
    this.transactionPrice = data.transactionPrice;
    this.source = data.source;
    this.phone = data.phone;
    this.titleOfPerson = data.titleOfPerson;
    this.notes = data.notes;

    this.dialogAddVisible = false;
    this.dialogEditVisible = true;
  }

  public onDelete(data: any): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onAdd(): void {
    this.clearTextBox();
    this.dialogAddVisible = true;
    this.dialogEditVisible = true;
  }

  public onOverlayAddClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onOverlayEditClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public addToGrid(): void {
    this.items = [
      ...this.items,
      {
        indexNum: this.items.length + 1,
        brand: this.brand,
        type: this.type,
        bidPrice: this.bidPrice,
        transactionPrice: this.transactionPrice,
        source: this.source,
        phone: this.phone,
        titleOfPerson: this.titleOfPerson,
        notes: this.notes,
      },
    ];

    this.clearTextBox();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearTextBox(): void {
    this.brand = '';
    this.type = '';
    this.bidPrice = '';
    this.transactionPrice = '';
    this.source = '';
    this.phone = '';
    this.titleOfPerson = '';
    this.notes = '';
  }
}

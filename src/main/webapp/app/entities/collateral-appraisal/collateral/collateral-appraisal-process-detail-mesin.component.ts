import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-mesin',
  templateUrl: './collateral-appraisal-process-detail-mesin.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-mesin.css'],
})
export class CollateralAppraisalDetailProcessMesinComponent {
  // Initiation
  public items = [
    {
      indexNum: 1,
      namaMsn: 'Mesin CNC Vertical Machining Centre 2017',
      tipeDoc: 'MFG',
      noDoc: '1VMC085XX065',
      tanggal: '12/02/2018',
      from: 'Debitur',
      amount: '278.000',
    },
  ];
  public dialogAddVisible = false;
  public dialogEditVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public namaMsn?: string;
  public tipeDoc?: string;
  public noDoc?: string;
  public tanggal?: string;
  public from?: string;
  public amount?: string;

  public onEdit(data: any): void {
    this.namaMsn = data.namaMsn;
    this.tipeDoc = data.tipeDoc;
    this.noDoc = data.noDoc;
    this.tanggal = data.tanggal;
    this.from = data.from;
    this.amount = data.amount;

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
    this.dialogEditVisible = false;
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
        namaMsn: this.namaMsn,
        tipeDoc: this.tipeDoc,
        noDoc: this.noDoc,
        tanggal: this.tanggal,
        from: this.from,
        amount: this.amount,
      },
    ];

    this.clearTextBox();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearTextBox(): void {
    this.namaMsn = '';
    this.tipeDoc = '';
    this.noDoc = '';
    this.tanggal = '';
    this.from = '';
    this.amount = '';
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-mesin',
  templateUrl: './collateral-appraisal-process-detail-mesin.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-mesin.component.css'],
})
export class CollateralAppraisalDetailProcessMesinComponent {
  public namaMsn?: string;
  public tipeDoc?: string;
  public noDoc?: string;
  public tanggal?: string;
  public from?: string;
  public amount?: string;
  public state = 'idle';
  public dialogVisible = false;
  public dialogAddVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };
  public items = [
    {
      indexNum: 1,
      namaMsn: 'Mesin CNC Vertical Machining Centre 2017',
      tipeDoc: 'MFG',
      noDoc: '1VMC085XX065',
      tanggal: '12/02/2018',
      from: 'Debitur',
      amount: '278.000',

      // merkMsn: 'Merek Mesin',
      // buatan: 'Buatan',
      // tahun: 'Tahun',
      // typeMdl: 'Type Model',
      // jenis: 'MFG Date',
      // spesifikasi: 'Spesifikasi',
      // kondisi: 'Kondisi',
      // keterangan: 'Keterangan',
    },
  ];

  public onEdit(data: any): void {
    this.namaMsn = data.namaMsn;
    this.tipeDoc = data.tipeDoc;
    this.noDoc = data.noDoc;
    this.tanggal = data.tanggal;
    this.from = data.from;
    this.amount = data.amount;

    this.state = 'idle';
    this.dialogVisible = true;
  }

  public onDelete(data: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
  }

  public add(ev: any): void {
    this.clearTextBox();
    this.dialogAddVisible = true;
    this.state = 'add';
  }

  public clearTextBox(): void {
    this.namaMsn = '';
    this.tipeDoc = '';
    this.noDoc = '';
    this.tanggal = '';
    this.from = '';
    this.amount = '';
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public onOverlayAddClick(): void {
    this.dialogAddVisible = false;
  }

  public addToGrid(ev: any): void {
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

    // clear form values
    this.clearTextBox();

    this.state = 'idle';
    this.dialogAddVisible = false;
  }
}

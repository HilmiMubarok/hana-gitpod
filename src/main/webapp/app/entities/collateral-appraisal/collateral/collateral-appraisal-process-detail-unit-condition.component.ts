import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-unit-condition',
  templateUrl: './collateral-appraisal-process-detail-unit-condition.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-unit-condition.css'],
})
export class CollateralAppraisalDetailProcessUnitConditionComponent {
  // Initiation
  public items = [
    {
      indexNum: 1,
      bpkbNum: 'N-08895-402',
      namaNum: 'PT SNP Indonesia',
      vehicleNum: 'PB 8662 AE',
      stnkNum: 'Not Recieved',
      chasisNum: 'MMHHKL01KLH21',
      machineNum: '4D56AUW9082',
      invoiceNum: '002026/0519/02',
      tahunNum: '2019',
    },
  ];
  public dialogAddVisible = false;
  public dialogEditVisible = false;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Model
  public bpkbNum?: string;
  public namaNum?: string;
  public vehicleNum?: string;
  public stnkNum?: string;
  public chasisNum?: string;
  public machineNum?: string;
  public invoiceNum?: string;
  public tahunNum?: string;

  public onEdit(data: any): void {
    this.bpkbNum = data.bpkpNum;
    this.namaNum = data.namaNum;
    this.vehicleNum = data.vehicleNum;
    this.stnkNum = data.stnkNum;
    this.chasisNum = data.chasisNum;
    this.machineNum = data.machineNum;
    this.invoiceNum = data.invoiceNum;
    this.tahunNum = data.tahunNum;

    this.dialogAddVisible = true;
    this.dialogEditVisible = false;
  }

  public onDelete(data: any): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onAdd(): void {
    this.clearitems();
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

  public addToGrid(ev: any): void {
    this.items = [
      ...this.items,
      {
        indexNum: this.items.length + 1,
        bpkbNum: this.bpkbNum,
        namaNum: this.namaNum,
        vehicleNum: this.vehicleNum,
        stnkNum: this.stnkNum,
        chasisNum: this.chasisNum,
        machineNum: this.machineNum,
        invoiceNum: this.invoiceNum,
        tahunNum: this.tahunNum,
      },
    ];

    this.clearitems();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearitems(): void {
    this.bpkbNum = '';
    this.namaNum = '';
    this.vehicleNum = '';
    this.stnkNum = '';
    this.chasisNum = '';
    this.machineNum = '';
    this.invoiceNum = '';
    this.tahunNum = '';
  }
}

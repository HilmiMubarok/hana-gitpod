import { Component, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ICollateralProperty, CollateralProperty } from '../../collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-unit-condition',
  templateUrl: './collateral-appraisal-process-detail-unit-condition.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-unit-condition.css'],
})
export class CollateralAppraisalDetailProcessUnitConditionComponent {
  @Output() outputItems = new EventEmitter();
  // Initiation
  public items?: ICollateralProperty[] = new Array<ICollateralProperty>();
  public itemsMod = [];
  public dialogVisible = false;
  public isAdd?: boolean;
  public width = '90%';
  public height = '90%';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor(private cdr: ChangeDetectorRef) {}

  // Model
  public bpkbNum?: string;
  public bpkbName?: string;
  public vehicleNum?: string;
  public stnkNum?: string;
  public chassisNum?: string;
  public machineNum?: string;
  public vehInvNum?: string;
  public tahunNum?: number;

  public onEdit(data: any): void {
    this.isAdd = false;
    this.dialogVisible = true;

    this.bpkbNum = data.bpkpNum;
    this.bpkbName = data.bpkbName;
    this.vehicleNum = data.vehicleNum;
    this.stnkNum = data.stnkNum;
    this.chassisNum = data.chassisNum;
    this.machineNum = data.machineNum;
    this.vehInvNum = data.vehInvNum;
    this.tahunNum = data.tahunNum;
  }

  public onDelete(data: any): void {
    this.dialogVisible = false;
  }

  public onAdd(): void {
    this.clearitems();
    this.isAdd = true;
    this.dialogVisible = true;
    this.cdr.detectChanges();
  }

  public onOverlayClick(): void {
    this.dialogVisible = false;
    this.cdr.detectChanges();
  }

  public addToGrid(ev: any): void {
    const newItem: ICollateralProperty = new CollateralProperty();
    newItem['bpkbNum'] = this.bpkbNum;
    newItem['bpkbName'] = this.bpkbName;
    newItem['vehNum'] = this.vehicleNum;
    newItem['stnkNum'] = this.stnkNum;
    newItem['chassisNum'] = this.chassisNum;
    newItem['vehMachineNum'] = this.machineNum;
    newItem['vehInvNum'] = this.vehInvNum;
    newItem['vehYear'] = this.tahunNum;
    this.items = [...this.items, newItem];
    this.itemsMod = [
      ...this.itemsMod,
      {
        indexNum: this.itemsMod.length + 1,
        bpkbNum: this.bpkbNum,
        bpkbName: this.bpkbName,
        vehicleNum: this.vehicleNum,
        stnkNum: this.stnkNum,
        chassisNum: this.chassisNum,
        machineNum: this.machineNum,
        vehInvNum: this.vehInvNum,
        tahunNum: this.tahunNum,
      },
    ];
    this.outputItems.emit(this.items);

    this.clearitems();

    this.dialogVisible = false;
    this.cdr.detectChanges();
  }

  public clearitems(): void {
    this.bpkbNum = '';
    this.bpkbName = '';
    this.vehicleNum = '';
    this.stnkNum = '';
    this.chassisNum = '';
    this.machineNum = '';
    this.vehInvNum = '';
    this.tahunNum = 0;
  }
}

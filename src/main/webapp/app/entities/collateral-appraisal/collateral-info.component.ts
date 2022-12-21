import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { STATUS } from 'app/shared/constants/status.constants';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralAppraisal } from './collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-info',
  templateUrl: './collateral-info.component.html',
  styleUrls: ['./collateral-info.css'],
})
export class CollateralInfoComponent implements OnInit {
  public status: any;
  private _collateral: ICollateral;
  public disabledOpt = true;
  public hiddenOpt = true;
  public type: string;

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }
  @Input()
  public collateralAppraisal: ICollateralAppraisal;
  @Input()
  public appraisal: ICollateralAppraisal;

  @Input()
  public mode: string;
  public propertySelectionMenu: string;

  constructor() {
    this.status = STATUS;
    this.propertySelectionMenu = '';
  }
  ngOnInit(): void {
    console.log('type', this.type);
  }

  public onSelectionMenuProperty(data: string): void {
    this.propertySelectionMenu = '';
    if (data.includes('land')) {
      this.propertySelectionMenu = 'land';
    }
  }

  public viewCollateralProperty(): boolean {
    if (
      this.appraisal.statusId !== STATUS.ASSIGNMENT &&
      this.appraisal.statusId !== STATUS.DRAFT &&
      this.appraisal.statusId !== STATUS.RETURNTORM &&
      this.appraisal.statusId !== STATUS.RETURNTOADMIN
    ) {
      return true;
    }
    return false;
  }
}

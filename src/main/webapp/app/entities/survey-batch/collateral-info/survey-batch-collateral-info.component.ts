import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-survey-batch-collateral-info',
  templateUrl: './survey-batch-collateral-info.component.html',
  styleUrls: ['./survey-batch-collateral-info.css'],
})
export class SurveyBatchCollateralInfoComponent {
  public status: any;
  private _collateral: ICollateral;
  public disabledOpt = true;
  public hiddenOpt = false;

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  @Input()
  public appraisal: ICollateralAppraisal;

  @Input()
  public mode: string;
  public propertySelectionMenu: string;

  constructor() {
    this.status = STATUS;
    this.propertySelectionMenu = '';
  }

  public onSelectionMenuProperty(data: string): void {
    this.propertySelectionMenu = '';
    if (data.includes('land')) {
      this.propertySelectionMenu = 'land';
    }
  }

  public viewCollateralProperty(): boolean {
    if (this.appraisal.statusId !== STATUS.ASSIGNMENT && this.appraisal.statusId !== STATUS.DRAFT) {
      return true;
    }
    return false;
  }
}

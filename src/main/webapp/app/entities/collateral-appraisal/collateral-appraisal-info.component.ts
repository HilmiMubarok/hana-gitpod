import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalInfoComponent {
  public branch?: string;
  public bmRm?: string;
  public segmentProduct?: Object[];
  public segmentProductFields: Object = { text: 'description', value: 'id' };
  public totalPlafond?: number;
  public dueDate?: Date;
  public noRequestAppraisal?: string;
  public collateralId?: string;
  public picName1?: string;
  public teleponNo1?: string;
  public picName2?: string;
  public teleponNo2?: string;
  public kjppIndependentAppraisal?: Object[];
  public kjppIndependentAppraisalFields: Object = { text: 'description', value: 'id' };
  public wilayahKota?: Object[];
  public wilayahKotaFields: Object = { text: 'description', value: 'id' };
  public teamReviewer?: Object[];
  public teamReviewerFields: Object = { text: 'description', value: 'id' };
}

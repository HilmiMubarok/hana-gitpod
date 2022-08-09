import { Component, Output, EventEmitter } from '@angular/core';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';

@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalInfoComponent {
  @Output() outputTipeOfficerAppraisal = new EventEmitter();
  public branch?: string;
  public bmRm?: string;
  public segmentProduct?: Object[];
  public segmentProductFields: Object = { text: 'description', value: 'id' };
  public totalPlafond?: number;
  public noRequestAppraisal?: string;
  public jenisObject?: string;
  public tipeOfficerAppraisal?: string;
  public kjppIndependentAppraisal?: Object[];
  public kjppIndependentAppraisalFields: Object = { text: 'description', value: 'id' };
  public wilayahKota?: Object[];
  public wilayahKotaFields: Object = { text: 'description', value: 'id' };
  public teamReviewer?: Object[];
  public teamReviewerFields: Object = { text: 'description', value: 'id' };
  public officerAppraisal?: Object[];
  public officerAppraisalFields?: Object = { text: 'description', value: 'id' };

  public selectTipeOfficerAppraisal(args: ChangeEventArgs): void {
    this.outputTipeOfficerAppraisal.emit(args['value']);
  }
}

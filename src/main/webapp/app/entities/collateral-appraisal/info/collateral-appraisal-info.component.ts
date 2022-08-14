import { Component, Output, EventEmitter } from '@angular/core';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';

@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
})
export class CollateralAppraisalInfoComponent {
  @Output() outputTipeOfficerAppraisal = new EventEmitter();
  public branch = 'Jakarta';
  public bmRm = 'Budiono';
  public segmentProduct = [
    {
      description: 'Segment Product 1',
      id: 'Segment Product 1',
    },
  ];
  public segmentProductFields: Object = { text: 'description', value: 'id' };
  public segmentProductValue = 'Segment Product 1';
  public totalPlafond?: number;
  public noRequestAppraisal = 'RA001';
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

  public renewalVal?: string;
  public newVal?: string;
  public additionalVal?: string;
  public progressVal?: string;
  public reappraisalVal?: string;
  public otherVal?: string;

  public selectTipeOfficerAppraisal(args: ChangeEventArgs): void {
    this.outputTipeOfficerAppraisal.emit(args['value']);
  }
}

import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';

@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal-info.css'],
})
export class CollateralAppraisalInfoComponent implements OnChanges {
  @Input() accountAuthorities?: Object[];
  @Output() outputTipeOfficerAppraisal = new EventEmitter();
  public branch = 'Jakarta';
  public bmRm = 'Budiono';
  public segmentProductFields: Object = { text: 'description', value: 'id' };
  public segmentProduct = [
    {
      id: '1',
      description: 'SME',
    },
    {
      id: '2',
      description: 'Corporate Bank',
    },
    {
      id: '3',
      description: 'Commercial Bank',
    },
    {
      id: '4',
      description: 'Korean Desk',
    },
    {
      id: '5',
      description: 'Enterprise Banking',
    },
  ];
  public segmentProductValue = '1';
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

  public isRoleSU?: boolean;
  public isRoleRM?: boolean;

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes @ngOnChanges Info : ', changes);
    this.initializeRole(changes);
  }

  private initializeRole(changes: SimpleChanges): void {
    this.isRoleSU = false;
    this.isRoleRM = false;

    for (let i = 0; i < changes.accountAuthorities.currentValue.length; i++) {
      if (changes.accountAuthorities.currentValue[i] === 'ROLE_RM') {
        this.isRoleRM = true;
      }
    }

    for (let i = 0; i < changes.accountAuthorities.currentValue.length; i++) {
      if (changes.accountAuthorities.currentValue[i] === 'ROLE_ADMIN') {
        this.isRoleSU = true;
      }
    }

    this.isRoleRM = this.isRoleSU ? false : this.isRoleRM;
  }

  public selectTipeOfficerAppraisal(args: ChangeEventArgs): void {
    this.outputTipeOfficerAppraisal.emit(args['value']);
  }
}

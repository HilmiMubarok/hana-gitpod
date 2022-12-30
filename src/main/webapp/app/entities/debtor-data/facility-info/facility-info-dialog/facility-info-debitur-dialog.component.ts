import { Component, Inject, Input, OnInit } from '@angular/core';
import lodash from 'lodash';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IDebtorData } from '../../debtor-data.model';
import { ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { CPFacility, ICPFacility } from 'app/shared/model/cp-facility.models';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-debitur-dialog',
  templateUrl: './facility-info-debitur-dialog.component.html',
})
export class FacilityInfoDebiturDialogComponent {
  public availablelimit: string;
  public cpFacility: ICPFacility;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cpFacility: ICPFacility;
    },
    private _dialog: MatDialogRef<FacilityInfoDebiturDialogComponent>
  ) {
    this.cpFacility = data.cpFacility;
  }

  public save(): void {
    this._dialog.close(this.cpFacility);
  }
}

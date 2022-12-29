import { Component, Inject, Input, OnInit } from '@angular/core';
import lodash from 'lodash';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IDebtorData } from '../../debtor-data.model';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-debitur-dialog',
  templateUrl: './facility-info-debitur-dialog.component.html',
})
export class FacilityInfoDebiturDialogComponent {
  public availablelimit: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      availablelimits: string;
    },
    private _dialog: MatDialogRef<FacilityInfoDebiturDialogComponent>
  ) {
    this.availablelimit = data.availablelimits;
  }

  public save(): void {
    this._dialog.close();
  }
}

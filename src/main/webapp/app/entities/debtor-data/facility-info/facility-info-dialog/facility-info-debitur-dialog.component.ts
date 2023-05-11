import { Component, Inject, Input, OnInit } from '@angular/core';
import lodash from 'lodash';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IDebtorData } from '../../debtor-data.model';
import { ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { CPFacility, ICPFacility } from 'app/shared/model/cp-facility.models';
import { IDebtorDataFacility } from '../../debtor-data-facility.model';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-debitur-dialog',
  templateUrl: './facility-info-debitur-dialog.component.html',
})
export class FacilityInfoDebiturDialogComponent implements OnInit {
  public availablelimit: string;
  public debtorData: IDebtorDataFacility;
  public preData: IDebtorDataFacility;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      debtorData: IDebtorDataFacility;
    },
    private _dialog: MatDialogRef<FacilityInfoDebiturDialogComponent>
  ) {
    this.debtorData = data.debtorData;
    this.preData = data.debtorData;
  }

  ngOnInit(): void {
    console.log('debtor data init ', this.debtorData);
  }

  public save(): void {
    this._dialog.close(this.debtorData);
  }
  public cancel(): void {
    this._dialog.close();
  }
}

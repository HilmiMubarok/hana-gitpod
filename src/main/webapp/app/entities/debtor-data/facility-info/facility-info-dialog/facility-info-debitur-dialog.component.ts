import { Component, Inject, Input, OnInit } from '@angular/core';
import lodash from 'lodash';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IDebtorData } from '../../debtor-data.model';
import { ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { CPFacility, ICPFacility } from 'app/shared/model/cp-facility.models';
import { IDebtorDataFacility } from '../../debtor-data-facility.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
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
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      debtorData: IDebtorDataFacility;
    },
    private _dialog: MatDialogRef<FacilityInfoDebiturDialogComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.debtorData = data.debtorData;
    this.preData = data.debtorData;
  }

  ngOnInit(): void {
    console.log('debtor data init ', this.debtorData);
  }

  public save(): void {
    this._dialog.close(this.debtorData);
  }
  // public cancel(): void {
  //   this._dialog.close();
  // }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}

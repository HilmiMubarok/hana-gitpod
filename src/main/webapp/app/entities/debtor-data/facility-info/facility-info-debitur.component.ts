import { Component, Input, OnInit } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';

import { MatDialog } from '@angular/material/dialog';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { DebtorData, IDebtorData } from '../debtor-data.model';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-debitur',
  templateUrl: './facility-info-debitur.component.html',
})
export class FacilityInfoDebiturComponent {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];
  public _data = [];
  public _deptorData: ICreditProposal;
  public _dataGroup = [];
  public availLimit: any = [];

  public displayColumns: string[] = [
    'no',
    'bank',
    'limit',
    'os',
    'facilityType',
    'rate',
    'period',
    'collateralType',
    'collateralValue',
    'tenor',
    'lastKol',
    'action',
  ];
  public aYear: any = [];

  @Input()
  get deptorData() {
    return this._deptorData;
  }

  set deptorData(deptor: ICreditProposal) {
    this._deptorData = deptor;
  }

  @Input()
  get data() {
    return this._data;
  }

  set data(object: any[]) {
    this._data = object;

    for (let i = 0; i < this._data.length; i++) {
      const date1 = new Date(this._data[i].FXFIG_TRX_DT);
      const date2 = new Date(this._data[i].FILN10_TOT_EXP_IL);
      this.aYear[i] = Math.round(Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24) / 360)) + ' ' + 'years';
    }
  }

  @Input()
  get dataGroup() {
    return this._dataGroup;
  }

  set dataGroup(object: any[]) {
    this._dataGroup = object;
    this.data = this.dataGroup;
  }

  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  constructor(public partyCifService: PartyCifService, protected _snackBar: MatSnackBar, public dialog: MatDialog) {}

  public facility: string;

  public showElement() {
    if (this.data[0].FILN11_COM_NM === 'CURRENT DEPOSITS') {
      return true;
    } else {
      return false;
    }
  }

  public openDialog(params: string) {
    const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
      width: '80vw',
      data: params,
    });
    dialogRef.afterClosed().subscribe((res: IDebtorData) => {
      console.log('cek res', res);
      if (res) {
        // this.data = lodash.cloneDeep(res)
        // console.log('cek data', this.data)
      }
    });
  }

  // group
  public openDialogGroup(params: IDebtorData = null) {
    const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
      width: '80vw',
      data: params,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.data = lodash.cloneDeep(res);
      }
    });
  }
}

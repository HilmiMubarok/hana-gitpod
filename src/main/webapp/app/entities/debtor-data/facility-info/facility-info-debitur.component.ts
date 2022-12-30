import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';

import { MatDialog } from '@angular/material/dialog';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { DebtorData, IDebtorData } from '../debtor-data.model';
import { ICPFacilityTable } from 'app/entities/credit-proposal/exposure/total-exposure/cp-facility-table-model';
import { ICPFacility } from 'app/shared/model/cp-facility.models';
// import { FacilityInfoDebiturDialogComponent } from './facility-info-dialog/facility-info-debitur-dialog.component';

@Component({
  selector: 'jhi-facility-info-debitur',
  templateUrl: './facility-info-debitur.component.html',
})
export class FacilityInfoDebiturComponent implements OnInit, OnChanges {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];
  public data: ICPFacility[] = [];
  public _data: ICPFacility[] = [];
  public _deptorData: ICreditProposal;
  private _debtorData: IDebtorData;
  public _dataGroup = [];
  public availLimit: any = [];
  public cpFacility: ICPFacilityTable;

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

  @Input() public dialogType: any;

  @Input()
  get debtorData() {
    return this._debtorData;
  }

  set debtorData(params: IDebtorData) {
    this._debtorData = params;
  }

  // @Input()
  // get data() {
  //   return this._data;
  // }

  // set data(object: any[]) {
  //   this._data = object;
  // }

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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['debtorData']) {
      this.mapingData(this.debtorData);
    }
  }

  ngOnInit(): void {
    console.log('this debtor data child', this.debtorData);
    console.log('ini data', this.data);
    console.log('collateral type', this.dialogType);
  }

  private mapingData(params: IDebtorData) {
    this._data = JSON.parse(params.attributes['cpFacility']);
    this.data = JSON.parse(params.attributes['cpFacility']);
    console.log('ini data', this.data);

    for (let i = 0; i < this._data.length; i++) {
      const date1 = new Date(this._data[i].FXFIG_TRX_DT);
      const date2 = new Date(this._data[i].FILN10_TOT_EXP_IL);
      this.aYear[i] = Math.round(Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24) / 360)) + ' ' + 'years';
    }
  }

  public showElement() {
    if (this.data[0].FILN11_COM_NM === 'CURRENT DEPOSITS') {
      return true;
    } else {
      return false;
    }
  }

  public openDialog(params: ICPFacility) {
    if (this.dialogType === 'debitur') {
      const dialogRef = this.dialog.open(FacilityInfoDebiturDialogComponent, {
        width: '80vw',
        data: {
          cpFacility: params,
        },
      });
      dialogRef.afterClosed().subscribe((data: ICPFacility) => {
        console.log('cek res facility', data);
        // if (data) {
        //   // this.data = lodash.cloneDeep(res)
        //   // console.log('cek data', this.data)
        // }
      });
    }
  }

  // group
  public openDialogGroup(params: IDebtorData) {
    if (this.dialogType === 'group') {
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
}

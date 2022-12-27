import { Component, Input, OnInit } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';

import { MatDialog } from '@angular/material/dialog';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-facility-info-debitur',
  templateUrl: './facility-info-debitur.component.html',
})
export class FacilityInfoDebiturComponent {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];
  public _data = [];
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
  ];
  public aYear: any = [];

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
      const availLimit = +this._data[i].FILN10_CONTRACT_AMT - +this._data[i].LNB_BASE_LON_JAN;
      this.availLimit[i] = availLimit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  constructor(public partyCifService: PartyCifService, protected _snackBar: MatSnackBar, public dialog: MatDialog) {}

  public facility: string;

  public showElement() {
    if (this.data[0].FILN11_COM_NM === 'CURRENT DEPOSITS') {
      return true;
    } else {
      return false;
    }
  }
}

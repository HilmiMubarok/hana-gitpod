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

  @Input()
  get data() {
    return this._data;
  }

  set data(object: any[]) {
    this._data = object;
  }

  constructor(public partyCifService: PartyCifService, protected _snackBar: MatSnackBar, public dialog: MatDialog) {}
}

import { Component, Input, OnInit } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data-slik-summary-debitur-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur',
  templateUrl: './debtor-data-slik-summary-debitur.component.html',
})
export class DeborDataSlikSummaryDebiturComponent extends AbstractEntityMaterialComponent<IPartySlik> implements OnInit {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];

  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this.dataPartySlik = object.sliks;
    this._partyCif = object;
  }

  @Input()
  get partySlik() {
    return this.dataPartySlik;
  }

  set partySlik(object: IPartySlik[]) {
    this.dataPartySlik = object;
  }

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
    'worseKol',
    'restructureWay',
    'action',
  ];
  constructor(public partySlikService: PartySlikService, protected _snackBar: MatSnackBar, public dialog: MatDialog) {
    super(_snackBar, partySlikService);
    this.loading = false;
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.dataPartySlik = [];
  }

  ngOnInit(): void {
    this.loadDataBy();

    console.log("cif", this.partyCif);
  }

  public loadDataBy(): void {
    this.partySlikService
      .queryFilterBy({
        idParty: this.partyCif.partyId,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public openDialog(element: IPartySlik = null): void {
    let object = {};
    for (let index = 0; index < this.dataPartySlik.length; index++) {
      if (this.dataPartySlik[index].partyId === element.partyId) {
        object = this.dataPartySlik;
      }
      const predicate = {
        width: '80vw',
        data: { object: this.dataPartySlik, mode: this.mode, cif: this.partyCif.customerNumber },
      };
      if (element) {
        // if (!lodash.has(element.attributes, 'os')) {
        //   element.attributes['os'] = '';
        // }
        if (!lodash.has(element.attributes, 'name')) {
          element.attributes['name'] = '';
        }
        if (!lodash.has(element.attributes, 'relationship')) {
          element.attributes['relationship'] = '';
        }
        if (!lodash.has(element.attributes, 'facilityType')) {
          element.attributes['facilityType'] = '';
        }
        // if (!lodash.has(element.attributes, 'lastCollectablility')) {
        //   element.attributes['lastCollectablility'] = '';
        // }
        predicate.data['partySlik'] = element;
      }
      const dialogRef = this.dialog.open(DebtorDataSlikSummaryDebiturDialogComponent, predicate);
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.loading = true;
          this.savePartySlik(res);
          this.dataPartySlik = lodash.unionBy([res], this.dataPartySlik, 'id');
          this.loading = false;
        }
      });
    }
  }

  public savePartySlik(res: IPartySlik) {
    this.partySlikService.update(res).subscribe((response: any) => {});
  }
}

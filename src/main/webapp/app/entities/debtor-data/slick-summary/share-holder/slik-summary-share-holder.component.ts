import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';

import { IslikSummmary } from './shere-holder.model';
import { IPartySlik, PartySlik } from 'app/entities/party-slik/party-slik.model';
import { DebtorDataSlikSummaryShareHolderDialogComponent } from './slik-summary-share-holder-dialog.component';

@Component({
  selector: 'jhi-debtor-data-slik-summary-share-holder',
  templateUrl: './slik-summary-share-holder.component.html',
  styleUrls: ['../slik.css'],
})
export class DebtorDataSlikSummaryShareHolderComponent implements OnInit {
  public loading: boolean;
  public data: IslikSummmary[];

  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
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
  constructor(public dialog: MatDialog) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.data = this.partyCif.debtorData.attributes['shered-holder'];
  }

  public openDialog(element: IPartySlik = null): void {
    const predicate = {
      width: '80vw',
      data: { object: this.partyCif },
    };
    // object: this.creditProposal
    // console.log('tanda', this.creditProposal);

    if (element) {
      predicate.data['partySlik'] = element;
      predicate.data['view'] = true;
    } else {
      const partySlik: IPartySlik = new PartySlik();
      partySlik.attributes = {};
      partySlik.attributes['name'] = '';
      partySlik.attributes['relationship'] = '';
      // partySlik.attributes['os'] = '';
      partySlik.attributes['facilityType'] = '';
      // partySlik.attributes['lastCollectablility'] = '';

      predicate.data['partySlik'] = partySlik;
      predicate.data['view'] = false;
    }

    const dialogRef = this.dialog.open(DebtorDataSlikSummaryShareHolderDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(res);
        this.partyCif.debtorData.attributes['shere-holder'] = [...this.partyCif.debtorData.attributes['shere-holder'], res];
      }
    });
  }
}

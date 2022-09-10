import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { IPartySlik, PartySlik } from 'app/entities/party-slik/party-slik.model';
import { SlikSummaryShareHolderDialogComponent } from './slik-summary-share-holder-dialog.component';

@Component({
  selector: 'jhi-slik-summary-share-holder',
  templateUrl: './slik-summary-share-holder.component.html',
})
export class SlikSummaryShareHolderComponent {
  public loading: boolean;

  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
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

  public openDialog(element: IPartySlik = null): void {
    const predicate = {
      width: '80vw',
      data: {},
    };

    if (element) {
      predicate.data['partySlik'] = element;
      predicate.data['view'] = true;
    } else {
      const partySlik: IPartySlik = new PartySlik();
      partySlik.attributes = {};
      partySlik.attributes['os'] = '';
      partySlik.attributes['facilityType'] = '';
      partySlik.attributes['lastCollectablility'] = '';

      predicate.data['partySlik'] = partySlik;
      predicate.data['view'] = false;
    }

    const dialogRef = this.dialog.open(SlikSummaryShareHolderDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['shareHolder'] = [...this.creditProposal.attributes['shareHolder'], res];
      }
    });
  }
}

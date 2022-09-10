import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { IPartySlik, PartySlik } from 'app/entities/party-slik/party-slik.model';
import { SlikSummaryBusinessGroupDialogComponent } from './slik-summary-business-group-dialog.component';

@Component({
  selector: 'jhi-slik-summary-business-group',
  templateUrl: './slik-summary-business-group.component.html',
})
export class SlikSummaryBusinessGroupComponent {
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

    const dialogRef = this.dialog.open(SlikSummaryBusinessGroupDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('res', res);

        this.creditProposal.attributes['businessGroup'] = [...this.creditProposal.attributes['businessGroup'], res];
      }
    });
  }
}

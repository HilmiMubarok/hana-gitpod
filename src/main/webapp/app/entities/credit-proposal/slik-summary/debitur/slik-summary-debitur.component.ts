import { Component, Input } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { SlikSummaryDebiturDialogComponent } from './slik-summary-debitur-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-slik-summary-debitur',
  templateUrl: './slik-summary-debitur.component.html',
  styleUrls: ['../slik.css'],
})
export class SlikSummaryDebiturComponent {
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

    const dialogRef = this.dialog.open(SlikSummaryDebiturDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loading = true;
        this.creditProposal.sliks = lodash.unionBy([res], this.creditProposal.sliks, 'id');
        this.loading = false;
      }
    });
  }
}

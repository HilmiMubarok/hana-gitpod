import { Component, Input } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data-slik-summary-debitur-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur',
  templateUrl: './debtor-data-slik-summary-debitur.component.html',
  styleUrls: ['../slik.css'],
})
export class DeborDataSlikSummaryDebiturComponent {
  public loading: boolean;

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

  public openDialog(element: IPartySlik = null): void {
    let object = {};
    for (let index = 0; index < this.partyCif.sliks.length; index++) {
      if (this.partyCif.sliks[index].partyId === element.partyId) {
        object = this.partyCif;
      }

      const predicate = {
        width: '80vw',
        data: { object: this.partyCif },
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
          this.partyCif.sliks = lodash.unionBy([res], this.partyCif.sliks, 'id');
          this.loading = false;
        }
      });
    }
  }
}

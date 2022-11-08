import { Component, Input } from '@angular/core';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data-slik-summary-debitur-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur',
  templateUrl: './debtor-data-slik-summary-debitur.component.html',
  styleUrls: ['../slik.css'],
})
export class DeborDataSlikSummaryDebiturComponent {
  public loading: boolean;
  @Input() mode: string;

  private _partySlik: IPartySlik[];
  @Input()
  get partySlik() {
    return this._partySlik;
  }

  set partySlik(object: IPartySlik[]) {
    this._partySlik = object;
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
  constructor(public dialog: MatDialog, public partySlikService: PartySlikService) {
    this.loading = false;
  }

  public openDialog(element: IPartySlik = null): void {
    let object = {};
    for (let index = 0; index < this.partySlik.length; index++) {
      if (this.partySlik[index].partyId === element.partyId) {
        object = this.partySlik;
      }
      const predicate = {
        width: '80vw',
        data: { object: this.partySlik, mode: this.mode },
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
          this.partySlik = lodash.unionBy([res], this.partySlik, 'id');
          this.loading = false;
        }
      });
    }
  }

  public savePartySlik(res: IPartySlik) {
    this.partySlikService.update(res).subscribe((response: any) => {});
  }
}

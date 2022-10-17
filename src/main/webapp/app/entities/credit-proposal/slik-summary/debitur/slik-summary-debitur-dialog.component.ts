import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { FACILITY_TYPE } from '../../../../shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-slik-summary-debitur-dialog',
  templateUrl: './slik-summary-debitur-dialog.component.html',
  styleUrls: ['../slik.css'],
})
export class SlikSummaryDebiturDialogComponent {
  public partySlik: IPartySlik;
  public creditProposal: ICreditProposal;
  public facility_types: any = FACILITY_TYPE;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      partySlik: IPartySlik;
    },
    private _dialog: MatDialogRef<SlikSummaryDebiturDialogComponent>
  ) {
    this.creditProposal = this.data.object;
    this.partySlik = this.data.partySlik;
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }

  public save(): void {
    this._dialog.close(this.partySlik);
  }
}

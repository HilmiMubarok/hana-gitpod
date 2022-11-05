import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from '../../credit-proposal.model';
import { NilaiRac, INilaiRac } from './nilai-pembelian.model';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-edit',
  templateUrl: './credit-proposal-risk-acceptance-criteria-edit.html',
  styleUrls: ['./nilai-pembelian.css'],
})
export class CreditProposalRacNilaiPembelianEditComponent {
  public nilaiRac: INilaiRac;
  public edit: boolean;

  item: ICreditProposal;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      lovBelow: INilaiRac;
      edit: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalRacNilaiPembelianEditComponent>
  ) {
    this.item = this.data.item;
    this.edit = this.data.edit;
    this.nilaiRac = this.data.lovBelow;
  }

  public save(): void {
    this._dialog.close(this.nilaiRac);
  }
}

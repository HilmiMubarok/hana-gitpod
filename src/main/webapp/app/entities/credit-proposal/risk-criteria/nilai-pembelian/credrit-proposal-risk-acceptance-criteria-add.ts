import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from '../../credit-proposal.model';
import { INilaiRac } from './nilai-pembelian.model';

@Component({
  selector: 'jhi-nilai-pembelian-add',
  templateUrl: './credrit-proposal-risk-acceptance-criteria-add.html',
  styleUrls: ['./nilai-pembelian.css'],
})
export class CreditProposalRacNilaiPembelianAddComponent {
  public nilaiRac: INilaiRac;
  public item: ICreditProposal;
  public view: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      lovBelow: INilaiRac;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalRacNilaiPembelianAddComponent>
  ) {
    (this.item = this.data.item), (this.view = this.data.view);
    this.nilaiRac = this.data.lovBelow;
  }

  public save(): void {
    this._dialog.close(this.nilaiRac);
  }
}

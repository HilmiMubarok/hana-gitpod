import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IScoreCard } from '../score-card.constant';

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral-dialog',
  templateUrl: './negative-collateral-dialog.component.html',
  styleUrls: ['../collateral-appraisal-negative-collateral.css'],
})
export class CollateralAppraisalNegativeCollateralDialogComponent {
  // public _item: IScoreCard[];
  public scoreCard: IScoreCard;
  // @Output()
  // public criteriaEvent = new EventEmitter<IScoreCard[]>();

  // @Input('item')
  // get item() {
  //   return this._item;
  // }

  // set item(item: IScoreCard[]) {
  //   this._item = item;
  // }

  public criteria: String = '';

  constructor(
    private _dialog: MatDialogRef<CollateralAppraisalNegativeCollateralDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { scoreCard: IScoreCard }
  ) {
    this.scoreCard = this.data.scoreCard;
  }

  public onAddToGrid(): void {
    if (this.criteria !== '') {
      this._dialog.close(this.criteria);
    } else {
      alert('Data Tidak Boleh Kosong');
      this._dialog.close();
    }
  }

  public onClose(): void {
    this._dialog.close();
  }
}

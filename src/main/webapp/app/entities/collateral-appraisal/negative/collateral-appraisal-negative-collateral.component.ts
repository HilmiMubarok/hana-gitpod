import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollateralAppraisalNegativeCollateralDialogComponent } from './dialog/negative-collateral-dialog.component';
import { IScoreCard, ScoreCard } from './score-card.constant';

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
  styleUrls: ['./collateral-appraisal-negative-collateral.css'],
})
export class CollateralAppraisalNegativeCollateralComponent {
  private _item: IScoreCard[];

  @Output()
  public criteriaEvent = new EventEmitter<IScoreCard[]>();

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: IScoreCard[]) {
    this._item = item;
  }

  public criteria: String = '';
  public dialogVisible: boolean;
  public loading: boolean;

  constructor(public dialog: MatDialog) {
    this.dialogVisible = false;
    this.loading = false;
  }

  public openDialog(scorecard: IScoreCard[] = null): void {
    const predicate = {
      width: '45vw',
    };

    if (scorecard) {
      predicate['data'] = { scoreCard: scorecard };
    } else {
      const score: IScoreCard = new ScoreCard();
      predicate['data'] = { ScoreCard: score };
    }

    const dialogRef = this.dialog.open(CollateralAppraisalNegativeCollateralDialogComponent, predicate);

    dialogRef.afterClosed().subscribe(res => {
      this.onAddToGrid(res);
      console.log('Test', res);
    });
  }

  public onAddToGrid(value: string): void {
    const newItem: IScoreCard = { id: this.item.length + 1, criteria: value.toString(), value: 'no' };
    const copyItems: IScoreCard[] = this.item;
    copyItems.push(newItem);
    this.item = [...new Set([...this.item, ...copyItems])];
  }

  public selectScoreCard(data: IScoreCard, value: string) {
    const idx = this.item
      .map(function (e) {
        return e.id;
      })
      .indexOf(data.id);

    this.item[idx].value = value;
  }

  public clearTextBox(): void {
    this.criteria = '';
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IScoreCard, ScoreCard } from './score-card.constant';

@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
  styleUrls: ['../collateral-appraisal-main.css'],
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
  public dialogVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor() {}

  public onAdd(): void {
    this.dialogVisible = true;
  }

  public onAddToGrid(): void {
    const newItem: IScoreCard = { id: this.item.length + 1, criteria: this.criteria.toString(), value: 'no' };
    const copyItems: IScoreCard[] = this.item;
    copyItems.push(newItem);

    this.item = [...new Set([...this.item, ...copyItems])];
    this.criteriaEvent.emit(this.item);
    this.clearTextBox();
    this.dialogVisible = false;
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

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }
}

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import { CollateralAppraisalNegativeCollateralDialogComponent } from './dialog/negative-collateral-dialog.component';
import { IScoreCard, ScoreCard } from './score-card.constant';
import { STATUS } from 'app/shared/constants/status.constants';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { NumberFormat } from '@syncfusion/ej2-angular-spreadsheet';
import lodash from 'lodash';
@Component({
  selector: 'jhi-collateral-appraisal-negative-collateral',
  templateUrl: './collateral-appraisal-negative-collateral.component.html',
  styleUrls: ['./collateral-appraisal-negative-collateral.css'],
})
export class CollateralAppraisalNegativeCollateralComponent implements OnChanges, OnInit {
  private _item: IScoreCard[];
  @Input() collateralAppraisal: ICollateralAppraisal;
  public dataCollateralAppraisal: ICollateralAppraisal;
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
  public scoreCard: any;
  public dialogVisible: boolean;
  public loading: boolean;
  public dataSource;
  public score: IScoreCard[] = [];

  constructor(public dialog: MatDialog, private generalParameterService: GeneralParameterService) {
    this.dialogVisible = false;
    this.loading = false;
  }
  ngOnInit(): void {
    this.getLovParameter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataCollateralAppraisal = changes.collateralAppraisal.currentValue;
    this.getLovParameter();
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
    });
  }

  public onAddToGrid(value: string): void {
    const newItem: IScoreCard = { id: this.item.length + 1, criteria: value.toString(), value: 'yes' };
    const copyItems: IScoreCard[] = this.item;
    copyItems.push(newItem);
    this.item = [...new Set([...this.item, ...copyItems])];
    this.criteriaEvent.emit(this.item);
  }

  public selectScoreCard(data: IScoreCard, value: string) {
    const idx = this.item
      .map(function (e) {
        return e.id;
      })
      .indexOf(data.id);

    this.item[idx].value = value;
    this.criteriaEvent.emit(this.item);
  }

  public clearTextBox(): void {
    this.criteria = '';
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
  public getLovParameter() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'NEGATIVE_COLLATERAL',
        page: 0,
        size: 9999,
        sort: ['id,asc'],
      })
      .subscribe(res => {
        const dataScoreCard = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < dataScoreCard.length; i++) {
          const num = i + 1;
          this.score[i] = { id: num, criteria: dataScoreCard[i].value, value: 'no' };
        }
        this.item = this.score;
        if (
          this.collateralAppraisal.attributes['scoreCard'].length === undefined ||
          this.collateralAppraisal.attributes['scoreCard'].length === 0
        ) {
          this.collateralAppraisal.attributes['scoreCard'] = this.item;
        } else {
          this.item = this.collateralAppraisal.attributes['scoreCard'];
        }
        console.log('item', this.collateralAppraisal.attributes['scoreCard'].length);
        console.log('push', (this.collateralAppraisal.attributes['scoreCard'] = this.item));
      });
  }
}

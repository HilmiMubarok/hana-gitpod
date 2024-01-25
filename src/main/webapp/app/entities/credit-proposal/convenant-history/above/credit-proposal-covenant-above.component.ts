import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-above-history',
  templateUrl: './credit-proposal-covenant-above.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantAboveHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGridAbove: any = dataCovenantAbove;
  public standardDataGridAbove: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  @Input() isViewMode: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService) {
    this.LovCovenantAbove();
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridAbove.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridAbove[i].status = input === 'status' ? event.value : this.standardDataGridAbove[i].status;
        this.standardDataGridAbove[i].deviation = input === 'deviation' ? event.target.value : this.standardDataGridAbove[i].deviation;
        this.standardDataGridAbove[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridAbove[i].justification;
      } else {
        this.standardDataGridAbove[i].status = this.statusValue[i];
        this.standardDataGridAbove[i].deviation = this.deviation[i];
        this.standardDataGridAbove[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.standardDataGridAbove);
  }

  public parsedAttr: any;
  public historyData() {
    this.parsedAttr = parsePreviousAtrribute(this.creditProposalItem);
    if (this.isOnCompareData) {
      if (this.isCompareDar) {
        // compare dar not done yet
        return this.creditProposalItem.attributes;
      } else {
        // previous return
        return this.parsedAttr.previousReturn;
      }
    } else {
      // previous history
      return this.parsedAttr.previousHistory;
    }
  }

  ngOnInit(): void {
    this.parsedAttr = parsePreviousAtrribute(this.creditProposalItem);
    this.LovCovenantAbove();
  }

  public historyAbove() {
    if (this.historyData().convenant.standardDataGridAbove.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.standardDataGridAbove.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardDataGridAbove[i].status;
        this.deviation[i] = this.historyData().convenant.standardDataGridAbove[i].deviation;
        this.justification[i] = this.historyData().convenant.standardDataGridAbove[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridAbove.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }
  }

  public LovCovenantAbove() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_ABOVE_STANDARD',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        const gridAbove = [];
        for (let i = 0; i < data.length; i++) {
          const num = i;
          gridAbove[i] = { id: num, covenant: this.addBRBeforeDash(data[i].value), status: 'Applied', deviation: '', justification: '' };
        }
        this.standardDataGridAbove = gridAbove;
        this.historyAbove();
      });
  }

  addBRBeforeDash(text: string): string {
    const parts = text.split('-');
    const result = parts.join('<br/> -');
    return result;
  }
}

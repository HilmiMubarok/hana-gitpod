import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackGeneral } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-general-history',
  templateUrl: './covenant-backtoback-general.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackGeneralHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGridBackToBackGeneral: any = dataCovenantBackToBackGeneral;
  public standardDataGridBackToBackGeneral: any = [];

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

  constructor(private generalParameterService: GeneralParameterService) {}

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridBackToBackGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackGeneral[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackGeneral[i].status;
        this.standardDataGridBackToBackGeneral[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackGeneral[i].deviation;
        this.standardDataGridBackToBackGeneral[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackGeneral[i].justification;
      } else {
        this.standardDataGridBackToBackGeneral[i].status = this.statusValue[i];
        this.standardDataGridBackToBackGeneral[i].deviation = this.deviation[i];
        this.standardDataGridBackToBackGeneral[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = lodash.clone(
      this.standardDataGridBackToBackGeneral
    );
  }

  public parseAttr: any;
  public historyData() {
    this.parseAttr = parsePreviousAtrribute(this.creditProposalItem);
    if (this.isOnCompareData) {
      if (this.isCompareDar) {
        // compare dar not done yet
        return this.creditProposalItem.attributes;
      } else {
        // Previous Proposal
        return this.parseAttr.previousReturn;
      }
    } else {
      // previous history
      return this.parseAttr.previousHistory;
    }
  }

  ngOnInit(): void {
    this.LovCovenantBtbGeneral();
    // console.log('proposal-type', this.creditProposalItem[])
  }

  public historyBtbGeneral() {
    if (this.historyData().convenant.standardDataGridBackToBackGeneral.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardDataGridBackToBackGeneral[i].status;
        this.deviation[i] = this.historyData().convenant.standardDataGridBackToBackGeneral[i].deviation;
        this.justification[i] = this.historyData().convenant.standardDataGridBackToBackGeneral[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }
  }

  public LovCovenantBtbGeneral() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_GENERAL_TIMES_CONDITION',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        const gridCondition = [];
        for (let i = 0; i < data.length; i++) {
          const num = i;
          gridCondition[i] = { id: num, covenant: data[i].value, status: 'Applied', deviation: '', justification: '' };
        }
        this.standardDataGridBackToBackGeneral = gridCondition;
        this.historyBtbGeneral();
      });
  }

  addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackDeposit } from '../convenant.constant';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-deposit-history',
  templateUrl: './covenant-backtoback-deposit.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackDepositHistoryComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;
  public standardDataGridBackToBackDeposit: any = [];

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
    for (let i = 0; i < this.standardDataGridBackToBackDeposit.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackDeposit[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackDeposit[i].status;
        this.standardDataGridBackToBackDeposit[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackDeposit[i].deviation;
        this.standardDataGridBackToBackDeposit[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackDeposit[i].justification;
      } else {
        this.standardDataGridBackToBackDeposit[i].status = this.statusValue[i];
        this.standardDataGridBackToBackDeposit[i].deviation = this.deviation[i];
        this.standardDataGridBackToBackDeposit[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = lodash.clone(
      this.standardDataGridBackToBackDeposit
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
        // previous proposal
        return this.parseAttr.previousReturn;
      }
    } else {
      // previous history => loan analys menu cp
      return this.parseAttr.previousHistory;
    }
  }

  ngOnInit(): void {
    this.LovCovenantBtbDeposit();

    // console.log('proposal-type', this.creditProposalItem[])
  }

  historyBtbDeposit() {
    if (this.historyData().convenant.standardDataGridBackToBackDeposit.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }
  }

  public LovCovenantBtbDeposit() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_TERMS_CONDITION',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        const data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        const gridDeposit = [];
        for (let i = 0; i < data.length; i++) {
          const num = i;
          gridDeposit[i] = { id: num, covenant: data[i].value, status: 'Applied', deviation: '', justification: '' };
        }
        this.standardDataGridBackToBackDeposit = gridDeposit;
        this.historyBtbDeposit();
      });
  }

  addBRBeforeDash(text: string): string {
    const hasil = text.replace(/(-) /g, '<br/>$1 ');
    return hasil;
  }
}

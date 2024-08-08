import { Component, Input, OnInit } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { CpMemoBandingService } from '../../services/cp-memo-banding.service';

@Component({
  selector: 'jhi-cp-memo-banding-covenant-back-to-back-deposit',
  templateUrl: './cp-memo-banding-covenant-back-to-back-deposit.component.html',
  styleUrls: ['../../../convenant/back-to-back/covenant-backtoback.css'],
})
export class CPMemoBandingCovenantBackToBackDepositComponent implements OnInit {
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

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService, private cpMemoBandingservice: CpMemoBandingService) {}

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

  ngOnInit(): void {
    this.LovCovenantBtbDeposit();
    // console.log('proposal-type', this.creditProposalItem[])
  }

  data;
  getData() {
    console.log('ASDHSADAS', {
      // compared,
      oriBefore: this.data,
      oriAfter: this.creditProposalItem.attributes,
    });

    return {};
  }

  addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }

  public getBackToBackDeposit() {
    if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = 'Applied';
        this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.status = this.statusValue[i];
      }

      this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
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
        this.getBackToBackDeposit();

        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
            this.standardDataGridBackToBackDeposit = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit;
          }
        }

        this.data = this.cpMemoBandingservice.parsePrevOfferingLetter(this.creditProposalItem);
        (this.parsed = this.cpMemoBandingservice.compareDeepData(
          this.data.convenant['standardDataGridBackToBackDeposit'],
          this.creditProposalItem.attributes['convenant']['standardDataGridBackToBackDeposit']
        )),
          console.log('ASDHSADAS', {
            // compared,
            oriBefore: this.data,
            oriAfter: this.creditProposalItem.attributes,
            compared: this.cpMemoBandingservice.compareDeepData(
              this.data.convenant['standardDataGridBackToBackDeposit'],
              this.creditProposalItem.attributes['convenant']['standardDataGridBackToBackDeposit']
            ),
          });
      });
  }
  parsed;
}

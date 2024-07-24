import { Component, Input, OnInit } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { CpMemoBandingService } from '../../services/cp-memo-banding.service';

@Component({
  selector: 'jhi-cp-memo-banding-covenant-back-to-back-general',
  templateUrl: './cp-memo-banding-covenant-back-to-back-general.component.html',
  styleUrls: ['../../../convenant/covenant-style.css'],
})
export class CPMemoBandingCovenantBackToBackGeneralComponent implements OnInit {
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

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService, private cpMemoBandingservice: CpMemoBandingService) {}

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridBackToBackGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackGeneral[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackGeneral[i].status;
        console.log('sddd', this.standardDataGridBackToBackGeneral);
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

  ngOnInit(): void {
    this.LovCovenantBtbGeneral();
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

  getBackToBackGeneral() {
    if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackGeneral.length; i++) {
        this.statusValue[i] = 'Applied';
        this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.status = this.statusValue[i];
      }

      this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.standardDataGridBackToBackGeneral;
    }
  }

  addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
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
        this.getBackToBackGeneral();

        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.standardDataGridBackToBackGeneral;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
            this.standardDataGridBackToBackGeneral = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral;
          }
        }

        this.data = this.cpMemoBandingservice.parsePrevOfferingLetter(this.creditProposalItem);
        (this.parsed = this.cpMemoBandingservice.compareDeepData(
          this.data.convenant['standardDataGridBackToBackGeneral'],
          this.creditProposalItem.attributes['convenant']['standardDataGridBackToBackGeneral']
        )),
          console.log('ASDHSADAS', {
            // compared,
            oriBefore: this.data,
            oriAfter: this.creditProposalItem.attributes,
            compared: this.cpMemoBandingservice.compareDeepData(
              this.data.convenant['standardDataGridBackToBackGeneral'],
              this.creditProposalItem.attributes['convenant']['standardDataGridBackToBackGeneral']
            ),
          });
      });
  }
  parsed;
}

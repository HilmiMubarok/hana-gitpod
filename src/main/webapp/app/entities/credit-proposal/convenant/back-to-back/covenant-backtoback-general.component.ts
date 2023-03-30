import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBackToBackGeneral } from '../convenant.constant';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-general',
  templateUrl: './covenant-backtoback-general.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackGeneralComponent implements OnInit {
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

  constructor(private generalParameterService: GeneralParameterService) {
    this.LovCovenantBtbGeneral();
  }

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

  ngOnInit(): void {
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

    // console.log('proposal-type', this.creditProposalItem[])
  }
  public LovCovenantBtbGeneral() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_ABOVE_STANDARD',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.standardDataGridBackToBackGeneral = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }
}

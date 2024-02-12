import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove } from '../convenant.constant';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-covenant-dar-above',
  templateUrl: './credit-proposal-covenant-above.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class DarCovenantAboveComponent implements OnInit {
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

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService) {}

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

  ngOnInit(): void {
    this.LovCovenantAbove();
  }

  public getStandardDataGridAbove() {
    if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridAbove.length; i++) {
        this.statusValue[i] = 'Applied';
        this.creditProposalItem.attributes['convenant'].standardDataGridAbove.status = this.statusValue[i];
      }
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
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
          gridAbove[i] = { id: num, covenant: data[i].value, status: 'Applied', deviation: '', justification: '' };
        }
        this.standardDataGridAbove = gridAbove;
        this.getStandardDataGridAbove();

        if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
        } else {
          for (let i = 0; i < this.standardDataGridAbove.length; i++) {
            this.standardDataGridAbove[i] = {
              covenant: this.standardDataGridAbove[i].covenant,
              deviation: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation,
              id: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].id,
              justification: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification,
              status: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status,
            };
          }
          this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
        }
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

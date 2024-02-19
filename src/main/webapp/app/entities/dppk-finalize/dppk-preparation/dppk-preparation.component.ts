import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-dppk-preparation',
  templateUrl: './dppk-preparation.component.html',
  styleUrls: ['./dppk-preparation.component.scss'],
})
export class DppkPreparationComponent {
  public _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor() {}
}

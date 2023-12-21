import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-binding-value-information',
  templateUrl: './binding-value-information.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class BindingValueInformationComponent implements OnInit {
  _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  constructor() {}

  ngOnInit(): void {
    console.log('test');
  }
}

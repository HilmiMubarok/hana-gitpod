import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { FidusiaAgreementService } from 'app/entities/fidusia-agreement/fidusia-agreement.service';

@Component({
  selector: 'jhi-binding-value-information',
  templateUrl: './binding-value-information.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class BindingValueInformationComponent implements OnInit {
  _creditProposal: ICreditProposal;
  private _collateralSummaryData: ICollateral[];

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input()
  get collateralSummaryData() {
    return this._collateralSummaryData;
  }

  set collateralSummaryData(item: ICollateral[]) {
    this._collateralSummaryData = item;
  }

  constructor(protected fidusiaAgreementService: FidusiaAgreementService) {}

  ngOnInit(): void {
    console.log('test');
  }
}

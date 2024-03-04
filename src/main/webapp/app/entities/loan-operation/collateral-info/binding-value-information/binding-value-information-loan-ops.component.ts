import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { FidusiaAgreementService } from 'app/entities/fidusia-agreement/fidusia-agreement.service';

@Component({
  selector: 'jhi-binding-value-information-loan-ops',
  templateUrl: './binding-value-information-loan-ops.component.html',
  styleUrls: ['../collateral-info-loan-ops.style.scss'],
})
export class BindingValueInformationLoanOpsComponent implements OnInit, OnChanges {
  _creditProposal: ICreditProposal;
  private _collateralSummaryData: ICollateral[];
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;
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
    this.getBindingGuarantee();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }
    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }
  public getBindingGuarantee() {
    if (this.creditProposal.attributes['guaranteeBinding']) {
      if (typeof this.creditProposal.attributes['guaranteeBinding'] === 'string') {
        this.creditProposal.attributes['guaranteeBinding'] = JSON.parse(this.creditProposal.attributes['guaranteeBinding']);
      }
    } else {
      this.creditProposal.attributes['guaranteeBinding'] = [];
    }
  }
}

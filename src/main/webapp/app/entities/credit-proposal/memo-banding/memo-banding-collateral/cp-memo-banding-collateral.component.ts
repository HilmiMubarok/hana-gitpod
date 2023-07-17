import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-cp-memo-banding-collateral',
  templateUrl: './cp-memo-banding-collateral.component.html',
  styleUrls: ['../../collateral-info/collateral-info-cp.style.scss'],
})
export class CpMemoBandingCollateralComponent implements OnChanges {
  @Input() creditProposal: ICreditProposal;
  proposalType: string;
  private _collateralProperties: ICollateralProperty[];

  ngOnChanges(changes: SimpleChanges) {
    this.proposalType = this.creditProposal.attributes['proposalType'];
    if (changes['collateralProperties']) {
      this._collateralProperties = changes['collateralProperties'].currentValue;
    }
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperties;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperties = item;
  }
}

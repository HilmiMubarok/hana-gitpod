import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CpMemoBandingService } from '../services/cp-memo-banding.service';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';

@Component({
  selector: 'jhi-cp-memo-banding-collateral',
  templateUrl: './cp-memo-banding-collateral.component.html',
  styleUrls: ['../../collateral-info/collateral-info-cp.style.scss'],
})
export class CpMemoBandingCollateralComponent implements OnChanges, OnInit {
  @Input() creditProposal: ICreditProposal;
  proposalType: string;
  private _collateralProperties: ICollateralProperty[];

  public parsed;
  public filtered: ICollateral[] = [];
  public dataProperty: ICollateralProperty[] = [];

  constructor(private cpMemoBandingservice: CpMemoBandingService, private collateralPropertyService: CollateralPropertyService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.proposalType = this.creditProposal.attributes['proposalType'];
    if (changes['collateralProperties']) {
      this._collateralProperties = changes['collateralProperties'].currentValue;
    }
  }

  ngOnInit() {
    this.parsed = this.cpMemoBandingservice.parsePrevOfferingLetter(this.creditProposal);

    this.filtered = this.parsed.collaterals.filter(obj => obj.statusId !== 'CANCEL' && obj.statusId !== 'RELEASE');

    if (this.filtered.length > 0) {
      for (let i = 0; i < this.filtered.length; i++) {
        if (this.filtered[i].id) {
          this.collateralPropertyService.queryFilterBy({ idCollateral: this.filtered[i].id, page: 0, size: 9999 }).subscribe(res => {
            this.dataProperty = [...this.dataProperty, ...res.body];
            console.log('data property ', this.dataProperty);
          });
        }
      }
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

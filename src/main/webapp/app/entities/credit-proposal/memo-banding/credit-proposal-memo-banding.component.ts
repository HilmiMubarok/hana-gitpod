import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import _ from 'lodash';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CPMemoBandingRemarkComponent } from './remarks/cp-memo-banding-remark.component';
import { MemoBandingCollateralService } from './memo-banding-collateral/memo-banding-collateral.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-credit-proposal-memo-banding',
  templateUrl: './credit-proposal-memo-banding.component.html',
})
export class MemoBandingComponent implements OnInit {
  constructor(
    private collateralService: CollateralService,
    private memoBandingCollateralService: MemoBandingCollateralService,
    private cashCollateralService: CashCollateralService
  ) {}

  @ViewChild('cpMemoBandingRemarkComponent', {
    static: false,
  })
  cpMemoBandingRemarkComponent: CPMemoBandingRemarkComponent;

  @Input() isViewMode: Boolean = false;

  ngOnInit(): void {
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
  }

  @Input() creditProposal: ICreditProposal;

  public loanFacilityData: unknown;
  public collateralData: unknown;
  public convenantData: unknown;

  /**
   * steps for compare data
   * 1. get data from creditProposal.products / creditProposal.collaterals / creditProposal.attributes['covenants'] => the current data (data1)
   * 2. get data from creditProposal.attributes['previousOfferingLetter'] => next data (data2)
   * 3. compare data1 and data2 using lodash
   * 4. if result is false, then add key 'isChanged' to changed data, add key 'isRemoved' to removed data, and add key 'noChanged' to no changed data
   * 5. assign data to loanFacilityData, collateralData, and convenantData. use this data to show in html
   */

  public collateralProperties: ICollateralProperty[] = [];
  public collateral: ICollateral[] = [];
  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 9999,
      })
      .subscribe(res => {
        this.collateral = res.body;
      });
  }
  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];

      // Set collateral properties to collateral service
      this.memoBandingCollateralService.setCollateralProperties(this.collateralProperties);
    });
  }
  public triggeredSave() {
    this.cpMemoBandingRemarkComponent.triggeredSave();
  }
}

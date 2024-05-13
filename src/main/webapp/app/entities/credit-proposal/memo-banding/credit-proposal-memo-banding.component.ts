import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import _ from 'lodash';
import { CpMemoBandingService } from './services/cp-memo-banding.service';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { memoBandingData } from './memo-banding';
import { CPMemoBandingRemarkComponent } from './remarks/cp-memo-banding-remark.component';
import { MemoBandingCollateralService } from './memo-banding-collateral/memo-banding-collateral.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-credit-proposal-memo-banding',
  templateUrl: './credit-proposal-memo-banding.component.html',
})
export class MemoBandingComponent implements OnInit {
  constructor(
    private cpMemoBandingService: CpMemoBandingService,
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private memoBandingCollateralService: MemoBandingCollateralService,
    private cashCollateralService: CashCollateralService
  ) {}

  @ViewChild('cpMemoBandingRemarkComponent', {
    static: false,
  })
  cpMemoBandingRemarkComponent: CPMemoBandingRemarkComponent;

  @Input() isViewMode: Boolean = false;

  ngOnInit(): void {
    // this.cpMemoBandingService.parseAttrCp(this.testData);
    // this.cpMemoBandingService.compareDeepData(this.d1, this.d2);
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
    this.findCollateralProperty(this.creditProposal.id);
  }

  testData = memoBandingData;

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

  public d1 = [
    {
      id: 1,
      name: 'john',
      age: 24,
    },
    {
      id: 2,
      name: 'Doe',
      age: 24,
    },
    {
      id: 3,
      name: 'John Doe',
      age: 24,
    },
  ];

  public d2 = [
    {
      id: 1,
      name: 'john',
      age: 24,
    },
    {
      id: 4,
      name: 'Jane Doe',
      age: 24,
    },
    {
      id: 2,
      name: 'Doe',
      age: 25,
    },
  ];

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

  public findCollateralProperty(applicationId: number): void {
    this.cashCollateralService.getCollateralProperty(applicationId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];

      // Set collateral properties to collateral service
      this.memoBandingCollateralService.setCollateralProperties(this.collateralProperties);
    });
  }

  public triggeredSave(proposalType: any) {
    this.cpMemoBandingRemarkComponent.triggeredSave();
  }
}

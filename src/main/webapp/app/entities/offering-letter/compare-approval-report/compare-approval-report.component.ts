import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-comprae-approval-report',
  templateUrl: './compare-approval-report.component.html',
  styleUrls: ['./compare-approval-report.css'],
})
export class CompareApprovalReportComponent implements OnInit {
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';

  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;
  public collateral: ICollateral[];
  public collateralProperties: ICollateralProperty[] = [];

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }

  constructor(protected collateralService: CollateralService, protected collateralPropertyService: CollateralPropertyService) {}

  ngOnInit() {
    this.loadByPartyId(this.creditProposal.cif.partyId);
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .subscribe(res => {
        this.collateral = res.body;
        if (this.collateral.length > 0) {
          for (let i = 0; i < this.collateral.length; i++) {
            this.findCollateralProperty(this.collateral[i]);
          }
        }
      });
  }

  public findCollateralProperty(collateral: ICollateral): void {
    if (collateral.id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
        this.collateralProperties = [...this.collateralProperties, ...res.body];
      });
    }
  }
}

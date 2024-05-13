import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
@Component({
  selector: 'jhi-loan-analys-previous-proposal',
  templateUrl: './loan-analys-previous-proposal.component.html',
  styleUrls: ['../loan-analys-previous-dar.css'],
})
export class LoanAnalysPreviousProposalComponent implements OnInit {
  private id: number;
  // private creditProposal: ICreditProposal;
  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;
  public collateral: ICollateral[] = [];
  public _collateralProperties: ICollateralProperty[] = [];

  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperties;
  }

  set collateralProperties(param: ICollateralProperty[]) {
    this._collateralProperties = param;
  }

  constructor(
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private cashCollateralService: CashCollateralService
  ) {}

  ngOnInit(): void {
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
    this.findCollateralProperty(this.creditProposal.id);
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .subscribe(res => {
        this.collateral = res.body;
      });
  }

  // find collateral property
  public findCollateralProperty(applicationId: number): void {
    this.cashCollateralService.getCollateralProperty(applicationId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
  }
  // constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, private router: Router) {
  //   this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
  //   this.activatedRoute.params.subscribe(params => {
  //     this.id = params['id'];
  //   });
}

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-agreement-compare-previous-dar',
  templateUrl: './agreement-compare-previous-dar.component.html',
  styleUrls: ['../compare-data-agremeent.css'],
})
export class AgreementComparePreviousDarComponent implements OnInit, OnChanges, OnDestroy {
  private id: number;
  // private creditProposal: ICreditProposal;
  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;
  public collateral: ICollateral[] = [];

  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';

  _collateralProperties: ICollateralProperty[];
  _collateralPropertyGroupData: ICollateralProperty[];

  @Input()
  get collateralProperties() {
    return this._collateralProperties;
  }

  set collateralProperties(param: ICollateralProperty[]) {
    this._collateralProperties = param;
  }

  @Input()
  get collateralPropertyGroupData() {
    return this._collateralPropertyGroupData;
  }

  set collateralPropertyGroupData(param: ICollateralProperty[]) {
    this._collateralPropertyGroupData = param;
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }

  constructor(
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private partyCifService: PartyCifService,
    private cashCollateralService: CashCollateralService
  ) {}

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralPropertyGroupData']) {
      this.loadDataBy();
    }

    if (changes['collateralProperties']) {
      this.collateralProperties = changes['collateralProperties'].currentValue;
    }
  }

  public countMV(id: number): number {
    const data: ICollateralProperty = this.collateralProperties.find(
      obj => obj.propertyType === 'GENERAL' && obj.collateralId === id && obj.external === false
    );
    if (data !== undefined) {
      if (data.marketValue === null) {
        return 0;
      } else {
        return data.marketValue;
      }
    }
    return 0;
  }

  public countLV(id: number): number {
    const data: ICollateralProperty = this.collateralProperties.find(
      obj => obj.propertyType === 'GENERAL' && obj.collateralId === id && obj.external === false
    );
    if (data !== undefined) {
      if (data.liquidationValue === null) {
        return 0;
      } else {
        return data.liquidationValue;
      }
    }
    return 0;
  }

  public listGroupCollateral: any;
  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
      this.getAllColGroup();
    });
  }

  private getAllColGroup() {
    return new Promise((resolve, reject) => {
      if (this.listGroupCollateral.length > 0) {
        for (let j = 0; j < this.listGroupCollateral.length; j++) {
          this.collateralService
            .queryFilterBy({
              idParty: this.listGroupCollateral[j].partyId,
              isActive: true,
            })
            .subscribe(res => {
              resolve(this.collateralPropertyGroupData);
            });
        }
      }
    });
  }
  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 999,
      })
      .subscribe(res => {
        this.collateral = res.body;
      });
  }

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
  }
  // constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, private router: Router) {
  //   this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
  //   this.activatedRoute.params.subscribe(params => {
  //     this.id = params['id'];
  //   });
}

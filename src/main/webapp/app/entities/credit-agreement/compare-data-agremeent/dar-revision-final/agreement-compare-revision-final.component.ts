import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Subject, takeUntil } from 'rxjs';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';

@Component({
  selector: 'jhi-agremeent-compare-revision-final',
  templateUrl: './agreement-compare-revision-final.component.html',
  styleUrls: ['../compare-data-agremeent.css'],
})
export class AgremeentCompareRevisionFinalComponent implements OnInit, OnDestroy {
  public selectedMenu: string;
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';
  public dataToCompare: any;
  public isDataToCompareExist: Boolean = false;
  public collateral: ICollateral[] = [];
  public menuItemsAll: MenuItemModel[] = [{ text: 'DAR REVISION FINAL' }, { text: 'PREVIOUS DAR' }];
  listGroupCollateral: any;
  ngOnInit(): void {
    this.selectedMenu = 'DAR REVISION FINAL';
    this.loadDataBy();
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
    if (this.listGroupCollateral.length > 0) {
      for (let j = 0; j < this.listGroupCollateral.length; j++) {
        if (this.listGroupCollateral[j].customerType === 'PERSONAL') {
          this.findCollateralPropertyGroup(this.listGroupCollateral[j].partyId);
        } else {
          this.findCollateralPropertyGroup(this.listGroupCollateral[j].partyId);
        }
      }
    }
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private cashCollateralService: CashCollateralService,
    private partyCifService: PartyCifService
  ) {}

  public setMenu(value): void {
    this.selectedMenu = value.item.properties.text;
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }

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
  public findCollateralPropertyGroup(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralPropertyGroupData = [...this.collateralProperties, ...res.body];
    });
  }
  public loadDataBy(): void {
    const cifNumber = this.creditProposal.customerNumber;
    this.partyCifService.getBusinessGroup(cifNumber).subscribe(res => {
      this.listGroupCollateral = res.body;
    });
  }
}

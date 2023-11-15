import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Subject, takeUntil } from 'rxjs';

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
  ngOnInit(): void {
    this.selectedMenu = 'DAR REVISION FINAL';
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  constructor(private collateralService: CollateralService, private collateralPropertyService: CollateralPropertyService) {}

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
  @Input()
  get collateralProperties() {
    return this._collateralProperties;
  }

  set collateralProperties(param: ICollateralProperty[]) {
    this._collateralProperties = param;
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.collateral = res.body;
        if (this.collateral.length > 0) {
          for (let i = 0; i < this.collateral.length; i++) {
            this.findCollateralProperty(this.collateral[i]);
          }
        }
      });
  }

  // find collateral property
  public findCollateralProperty(collateral: ICollateral): void {
    if (collateral.id) {
      this.collateralPropertyService
        .queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 })
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.collateralProperties = [...this.collateralProperties, ...res.body];
        });
    }
  }
}

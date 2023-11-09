import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { LoanAnalysService } from 'app/entities/loan-analys/loan-analys.service';

@Component({
  selector: 'jhi-agremeent-compare-revision-final',
  templateUrl: './agreement-compare-revision-final.component.html',
  styleUrls: ['../compare-data-agremeent.css'],
})
export class AgremeentCompareRevisionFinalComponent implements OnInit {
  public selectedMenu: string;
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';
  public dataToCompare: any;
  public isDataToCompareExist: Boolean = false;
  public collateral: ICollateral[] = [];
  public collateralProperties: ICollateralProperty[] = [];
  public menuItemsAll: MenuItemModel[] = [{ text: 'DAR REVISION FINAL' }, { text: 'PREVIOUS DAR' }];
  ngOnInit(): void {
    this.selectedMenu = 'DAR REVISION FINAL';
    this.selectedMenu === 'DAR REVISION FINAL' && this.getDarData();
    if (this.creditProposal.cif) {
      this.loadByPartyId(this.creditProposal.cif.partyId);
    }
  }

  constructor(
    private loanAnalysService: LoanAnalysService,
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService
  ) {}

  public getDarData() {
    this.loanAnalysService
      .getLaDarCheckerNotif(this.creditProposal.customerId.toString(), {
        page: 0,
        size: 999,
      })
      .subscribe(res => this.getDataToCompare(res.body));
  }

  public getDataToCompare(data: any) {
    // if data length === 0, then set this.dataToCompare = {}
    // if data length === 1, then set this.dataToCompare = data[0]
    // if data length > 1, then set this.dataToCompare = newest data by createdDate
    if (data.length === 0) {
      this.dataToCompare = {};
    } else {
      data.filter((item, index) => {
        if (index === 0) {
          this.dataToCompare = item;
          this.isDataToCompareExist = true;
        } else {
          if (item.createdDate > this.dataToCompare.createdDate) {
            this.dataToCompare = item;
            this.isDataToCompareExist = true;
          }
        }
      });
    }

    console.log('res', {
      ori: data,
      final: this.dataToCompare,
      isExist: this.isDataToCompareExist,
    });
  }

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

  // find collateral property
  public findCollateralProperty(collateral: ICollateral): void {
    if (collateral.id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
        this.collateralProperties = [...this.collateralProperties, ...res.body];
      });
    }
  }
}

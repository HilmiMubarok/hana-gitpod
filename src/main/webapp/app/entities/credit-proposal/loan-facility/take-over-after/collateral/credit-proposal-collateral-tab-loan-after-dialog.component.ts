import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import {
  ICreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { CreditProposalCollateralInfoDialogComponent } from 'app/entities/credit-proposal/collateral-info/dialog/credit-proposal-collateral-info-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

import { Observable, of } from 'rxjs';
import { CreditProposalCollateralTabLoanAfterComponent } from './credit-proposal-collateral-tab-loan-after.component';

@Component({
  selector: 'jhi-credit-proposal-collateral-tab-loan-after-dialog',
  templateUrl: './credit-proposal-collateral-tab-loan-after-dialog.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
  providers: [ToolbarService, HtmlEditorService],
})
export class CreditProposalCollateralTabLoanAfterDialogComponent implements OnInit {
  public view: string;
  public creditProposal: ICreditProposal;
  public dataCollateral: ICollateral[];
  public dataCollateralOption: ICollateral[];
  public collateralProperties: ICollateralProperty[];
  public disabledOpt = true;
  public collateral: ICollateral;
  public insurance: ICreditProposalCollateralInsurance;
  public marketability: string;
  public internalMV = 0;
  public internalLV = 0;
  public kjjpMV: number;
  public kjjpLV: number;
  public properties: ICollateralProperty[];
  public filteredOptionBindingTypes: Observable<string[]>;
  public binding: ICreditProposalCollateralBinding;
  public optionBindingTypes: string[] = [
    'HAK TANGGUNGAN (APHT)',
    'GADAI',
    'FEO',
    'SKMHT',
    'CESSIE',
    'HIPOTIK',
    'PERNYATAAN JAMINAN & KUASA',
    'BELUM DIIKAT',
    'LAINNYA',
  ];

  public insuranceTypes: string[] = ['Partner', 'Non - Partner'];

  constructor(
    private creditProposalService: CreditProposalService,
    private _dialog: MatDialogRef<CreditProposalCollateralTabLoanAfterComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      view: string;
      dataCollateral: ICollateral[];
      dataCollateralOptionx: ICollateral[];
      collateralProperties: ICollateralProperty[];
    }
  ) {
    this.creditProposal = this.data.cp;
    this.collateral = this.data.collateral;
    this.view = this.data.view;
    this.dataCollateral = data.dataCollateral;
    this.dataCollateralOption = data.dataCollateralOptionx;
    this.collateralProperties = data.collateralProperties;
  }

  ngOnInit(): void {
    if (this.view === 'view') {
      this.changeType(this.collateral.id);
    }
  }

  public getCertificateDueDate(): string {
    return this.creditProposalService.getCertificationDate(this.collateral, this.properties);
  }

  public filterBindingType(): void {
    const text: string = this.binding.bindingType;

    const regex = new RegExp(`\\b${text}`, 'i');
    const filtered: any = this.optionBindingTypes.filter(n => regex.test(n));

    this.filteredOptionBindingTypes = of(filtered);
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public changeType(id) {
    const collateral = this.dataCollateral.find(obj => obj.id === id);
    if (collateral) {
      this.internalMV = this.countMV(collateral);
      this.internalLV = this.countLV(collateral);
    } else {
      this.internalMV = 0;
      this.internalLV = 0;
    }
  }

  public countMV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          return 0;
        } else {
          return data.marketValue;
        }
      }
    }
    return 0;
  }

  public countLV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.liquidationValue === null) {
          return 0;
        } else {
          return data.liquidationValue;
        }
      }
    }
    return 0;
  }

  public onSave() {
    this._dialog.close(this.collateral);
  }
}

import { Component, Inject, Input } from '@angular/core';
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
export class CreditProposalCollateralTabLoanAfterDialogComponent {
  public creditProposal: ICreditProposal;
  public disabledOpt = true;
  public collateral: ICollateral;
  public insurance: ICreditProposalCollateralInsurance;
  public marketability: string;
  public internalMV: number;
  public internalLV: number;
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
      marketability: string;
      internalMV: number;
      internalLV: number;
      kjjpMV: number;
      kjjpLV: number;
      properties: ICollateralProperty[];
      binding: ICreditProposalCollateralBinding;
      insurance: ICreditProposalCollateralInsurance;
    }
  ) {
    // console.log('aliando', this.data.cp);
    this.creditProposal = this.data.cp;
    this.collateral = this.data.collateral;
    this.marketability = this.data.marketability;
    this.internalMV = this.data.internalMV;
    this.internalLV = this.data.internalLV;
    this.kjjpMV = this.data.kjjpMV;
    this.kjjpLV = this.data.kjjpLV;
    this.properties = this.data.properties;
    this.binding = this.data.binding;
    this.insurance = this.data.insurance;
  }

  public save() {
    if (!this.binding.collateralId) {
      this.binding.collateralId = this.collateral.id;
    }
    if (!this.insurance.collateralId) {
      this.insurance.collateralId = this.collateral.id;
    }
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      insurance: this.insurance,
    });
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
}

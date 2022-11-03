import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { Observable, of } from 'rxjs';
import { ICreditProposalCollateralBinding, ICreditProposalCollateralInsurance } from '../credit-proposal-collateral-info.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-dialog',
  templateUrl: './credit-proposal-collateral-info-dialog.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
  providers: [ToolbarService, HtmlEditorService],
})
export class CreditProposalCollateralInfoDialogComponent {
  public creditProposal: ICreditProposal;
  public creditProposalOpenState: ICreditProposal;
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
  public lovRank = [];
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
  public lovCollateralStatus: string[] = ['New', 'Existing', 'Released'];
  public insuranceTypes: string[] = ['Partner', 'Non - Partner'];

  constructor(
    private creditProposalService: CreditProposalService,
    private _dialog: MatDialogRef<CreditProposalCollateralInfoDialogComponent>,
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
    this.creditProposal = this.data.cp;
    this.creditProposalOpenState = lodash.cloneDeep(this.data.cp);
    this.collateral = this.data.collateral;
    this.marketability = this.data.marketability;
    this.internalMV = this.data.internalMV;
    this.internalLV = this.data.internalLV;
    this.kjjpMV = this.data.kjjpMV;
    this.kjjpLV = this.data.kjjpLV;
    this.properties = this.data.properties;
    this.binding = this.data.binding;
    this.insurance = this.data.insurance;
    for (let i = 1; i < 101; i++) {
      this.lovRank.push(i);
    }
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
      creditProposal: this.creditProposal,
      action: 'save',
    });
  }

  public cancel() {
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      insurance: this.insurance,
      creditProposal: this.creditProposalOpenState,
      action: 'cancel',
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

  public print() {
    console.log(this.collateral);
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposal = creditProposalMappingData;
  }
}

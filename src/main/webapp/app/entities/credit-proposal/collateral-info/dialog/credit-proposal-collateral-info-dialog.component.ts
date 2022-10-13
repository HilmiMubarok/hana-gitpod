import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { Observable, of } from 'rxjs';
import { ICreditProposalCollateralBinding, ICreditProposalCollateralInsurance } from '../credit-proposal-collateral-info.model';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-dialog',
  templateUrl: './credit-proposal-collateral-info-dialog.component.html',
  providers: [ToolbarService, HtmlEditorService],
})
export class CreditProposalCollateralInfoDialogComponent {
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
    private _dialog: MatDialogRef<CreditProposalCollateralInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
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

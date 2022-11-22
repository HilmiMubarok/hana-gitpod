import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICreditProposalCollateralBinding } from '../credit-proposal-collateral-info.model';
import { IEmptyField } from './empty-field.model';
import { Observable, of } from 'rxjs';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-dialog',
  templateUrl: './dialog-credit-proposal-collateral-info-btb.component.html',
  styleUrls: ['../../proposal-basic-information.css'],
  providers: [ToolbarService, HtmlEditorService],
})
export class DialogCreditProposalCollateralInfoDialogBTBComponent {
  public collateral: ICollateral;
  public creditProposal: ICreditProposal;
  public creditProposalOpenState: ICreditProposal;
  public binding: ICreditProposalCollateralBinding;
  public empty: IEmptyField;
  public filteredOptionBindingTypes: Observable<string[]>;
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
  constructor(
    private _dialog: MatDialogRef<DialogCreditProposalCollateralInfoDialogBTBComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      binding: ICreditProposalCollateralBinding;
      emptyField: IEmptyField;
    }
  ) {
    this.creditProposal = this.data.cp;
    this.creditProposalOpenState = lodash.cloneDeep(this.data.cp);
    this.collateral = this.data.collateral;
    this.binding = this.data.binding;
    this.empty = this.data.emptyField;
  }

  public filterBindingType(): void {
    const text: string = this.binding.bindingType;

    const regex = new RegExp(`\\b${text}`, 'i');
    const filtered: any = this.optionBindingTypes.filter(n => regex.test(n));

    this.filteredOptionBindingTypes = of(filtered);
  }

  public save() {
    if (!this.binding.collateralId) {
      this.binding.collateralId = this.collateral.id;
    }

    if (!this.empty.collateralId) {
      this.empty.collateralId = this.collateral.id;
    }

    this._dialog.close({
      collateral: this.collateral,
      binding: this.binding,
      emptyField: this.empty,
      creditProposal: this.creditProposal,
      action: 'save',
    });
  }

  public cancel() {
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      creditProposal: this.creditProposalOpenState,
      action: 'cancel',
    });
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposal = creditProposalMappingData;
  }
}

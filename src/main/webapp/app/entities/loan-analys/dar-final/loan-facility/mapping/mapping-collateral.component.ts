import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../../../credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-mapping-collateral-temp',
  templateUrl: './mapping-collateral.component.html',
})
export class CreditProposalMappingCollateralTempComponent {
  @Output() outputCreditProposalMappingData = new EventEmitter();

  public collateralInfo: any;
  public creditProposalData: any;
  public applicationProductData: any;

  public displayColumns: string[] = ['no', 'collateralType', 'address', 'lvInternal', 'mvInternal', 'bindingValue', 'select'];

  public bindingValueHelper: any = [];
  public mappingStatusHelper: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
      collateralInfo: ICollateral;
      collateralProductRelations: any; // seharusnya ICollateralProductRelation
      creditProposaldata: ICreditProposal;
    }
  ) {
    this.collateralInfo = this.data.collateralInfo;
    this.applicationProductData = this.data.applicationProduct;
    this.creditProposalData = this.data.creditProposaldata;
    this.setUp();
  }

  private setUp(): void {
    if (this.collateralInfo.length > 0) {
      for (let i = 0; i < this.collateralInfo.length; i++) {
        this.bindingValueHelper.push(0);
        this.mappingStatusHelper.push('no');
        if (this.creditProposalData.collateralProductRelations.length > 0) {
          for (let j = 0; j < this.creditProposalData.collateralProductRelations.length; j++) {
            if (
              this.creditProposalData.collateralProductRelations[j].collateralId === this.collateralInfo[i].id &&
              this.creditProposalData.collateralProductRelations[j].applicationProduct.id === this.applicationProductData.id
            ) {
              this.bindingValueHelper[i] = this.creditProposalData.collateralProductRelations[j].bindingValue;
              this.mappingStatusHelper[i] = 'yes';
            }
          }
        }
      }
    }
  }

  public onChangeBindingValue(event: any, index: number): void {
    if (this.creditProposalData.collateralProductRelations.length > 0) {
      for (let i = 0; i < this.creditProposalData.collateralProductRelations.length; i++) {
        if (
          this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralInfo[index].id &&
          this.creditProposalData.collateralProductRelations[i].applicationProduct.id === this.applicationProductData.id
        ) {
          this.creditProposalData.collateralProductRelations[i].bindingValue = event.target.value;
        }
      }
    }

    this.outputCreditProposalMappingData.emit(this.creditProposalData);
  }

  public changeBuildingFacility(event: MatCheckboxChange, index: number): void {
    if (event.checked === true) {
      const tempCollateralProductRelationObject = {
        collateralId: this.collateralInfo[index].id,
        bindingValue: this.bindingValueHelper[index],
        applicationProduct: this.applicationProductData,
      };

      this.creditProposalData.collateralProductRelations.push(tempCollateralProductRelationObject);
    } else if (event.checked === false) {
      if (this.creditProposalData.collateralProductRelations.length > 0) {
        for (let i = 0; i < this.creditProposalData.collateralProductRelations.length; i++) {
          if (
            this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralInfo[index].id &&
            this.creditProposalData.collateralProductRelations[i].applicationProduct.id === this.applicationProductData.id
          ) {
            this.creditProposalData.collateralProductRelations.splice(i, 1);
          }
        }
      }
    }

    this.outputCreditProposalMappingData.emit(this.creditProposalData);
  }
  public sableFeild() {
    if (this.collateralInfo.statusId === STATUS.APPROVE) {
      return true;
    }
    return false;
  }
}

import { Component, Inject, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-mapping-collateral',
  templateUrl: './mapping-collateral.component.html',
  // styleUrls: ['./dialog-facility.css'],
})
export class CreditProposalMappingCollateralComponent {
  public collateralInfo: any;
  public collateralProductRelations: any;
  public applicationProdCustom: any;
  public creditProposaldata: any;
  public applicationProduct: IApplicationProduct;

  private _collateral: ICollateral;
  private _creditproposal: ICreditProposal;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
    this.checkData();
  }

  @Input()
  get creditProposal() {
    return this._creditproposal;
  }
  set creditProposal(param: ICreditProposal) {
    this._creditproposal = param;
    // this.checkData();
  }

  public displayColumns: string[] = ['no', 'collateralType', 'address', 'lvInternal', 'mvInternal', 'bindingValue', 'select'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
      collateralInfo: any;
      collateralProductRelations: any;
      creditProposaldata: any;
    }
  ) {
    this.collateralInfo = this.data.collateralInfo;
  }

  private setAttribute(): void {
    if (!lodash.has(this.collateralInfo.attributes, 'bindingValue')) {
      const attr: object = this.collateralInfo.attributes;
      this.collateralInfo.attributes = lodash.merge({}, attr, new CollateralAttribute());
    }
  }

  public checkData() {
    if (this.collateralProductRelations.length > 0) {
      for (let j = 0; j < this.collateralProductRelations.length; j++) {
        for (let i = 0; i < this.collateralInfo.length; i++) {
          this.collateralInfo[i].attributes.bindingValue = '';
          if (this.collateralInfo[i].id === this.collateralProductRelations[j].collateral.id) {
            this.collateralInfo[i].attributes.bindingValue = this.collateralProductRelations.bindingValue;
            // this.collateralInfo[i].attributes.bindingValue = this.collateralProductRelations.collateral.id;
            break;
          }
        }
      }
    }
  }

  bindingValueChange(event: any, index: any) {
    this.setAttribute();
    this.collateralInfo[index].attributes['bindingValue'] = event;
  }

  // cekBox
  private setAttributeCheckBox(): void {
    if (!lodash.has(this.collateralInfo.attributes, 'mappingStatus')) {
      const attr: object = this.collateralInfo.attributes;
      this.collateralInfo.attributes = lodash.merge({}, attr, new CollateralAttribute());
    }
  }

  changeBuildingFacility(event: MatCheckboxChange, index: any): void {
    const value: boolean = event.checked;
    this.setAttributeCheckBox();
    this.collateralInfo[index].attributes['mappingStatus'] = value === true ? 'yes' : 'no';
    if (value === true) {
      const dataData = this.applicationProduct;
      if (this.creditProposaldata.collateralProductRelations[index].id != null) {
        // this.creditProposaldata.collateralProductRelations.splice(1);
        this.creditProposaldata.collateralProductRelations.push({
          id: this.creditProposaldata.collateralProductRelations[index].id,
          collateralId: this.collateralInfo[index].id,
          bindingValue: this.collateralInfo[index].attributes['bindingValue'],
          applicationProduct: dataData,
        });
      }
    } else if (value === false) {
      this.collateralProductRelations.filter(function (e) {
        return e.mappingStatus !== 'no';
      });
      // this.creditProposaldata.collateralProductRelations.splice(1);
    }
  }
}

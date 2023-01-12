import { Component, Inject, Output, EventEmitter, OnChanges, SimpleChanges, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash, { toUpper } from 'lodash';
import { STATUS } from 'app/shared/constants/status.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-mapping-facility',
  templateUrl: './mapping-facility.component.html',
})
export class CreditProposalMappingFacilityComponent implements OnInit, OnChanges {
  @Output() outputCreditProposalMappingData = new EventEmitter();
  @Input() creditProposal: ICreditProposal;
  @Input() collateralData: ICollateral;

  public collateralInfo: any;
  public creditProposalData: any;
  public applicationProductData: any;
  public checked: boolean;
  public disableField: any;
  public field: boolean;

  public displayColumns: string[] = ['no', 'applicationType', 'facilityType', 'subLimit', 'currency', 'bindingValue', 'select'];

  public bindingValueHelper: any = [];
  public mappingStatusHelper: any = [];
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
      collateral: ICollateral;
      cp: ICreditProposal;
    }
  ) {
    this.collateralInfo = this.data.collateral;
    this.applicationProductData = this.data.applicationProduct;
    this.creditProposalData = this.data.cp;
    this.setUp();
    this.checked = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralData']) {
      this.setUp();
    }
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.field === false;
    } else {
      this.field === true;
    }
    this.sableFeild();
  }
  public sableFeild() {
    this.disableField = this.router.url.split('/')[1];
    if (
      this.disableField === 'cp-status-approval' ||
      this.disableField === 'la-analyst' ||
      this.disableField === 'la-approval-inquiry' ||
      this.disableField === 'la-approval' ||
      this.disableField === 'la-SME-CRC'
    ) {
      this.field = true;
    }
  }

  public setCrossCollateral(index: number) {
    if (this.collateralData) {
      if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
        const tempCollateralProductRelationObject = {
          collateralId: this.collateralInfo.id,
          bindingValue: this.bindingValueHelper[index],
          applicationProduct: this.applicationProductData[index],
        };
        this.creditProposalData.collateralProductRelations.push(tempCollateralProductRelationObject);
      }
    }
  }

  private setUp(): void {
    if (this.applicationProductData.length > 0) {
      for (let i = 0; i < this.applicationProductData.length; i++) {
        this.bindingValueHelper.push(0);
        this.mappingStatusHelper.push('no');
        this.setCrossCollateral(i);
        if (this.creditProposalData.collateralProductRelations) {
          if (this.creditProposalData.collateralProductRelations.length > 0) {
            for (let j = 0; j < this.creditProposalData.collateralProductRelations.length; j++) {
              if (
                this.creditProposalData.collateralProductRelations[j].collateralId === this.collateralInfo.id &&
                this.creditProposalData.collateralProductRelations[j].applicationProduct.id === this.applicationProductData[i].id
              ) {
                this.bindingValueHelper[i] = this.creditProposalData.collateralProductRelations[j].bindingValue;
                this.mappingStatusHelper[i] = 'yes';
              }
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
          this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralInfo.id &&
          this.creditProposalData.collateralProductRelations[i].applicationProduct.id === this.applicationProductData[index].id
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
        collateralId: this.collateralInfo.id,
        bindingValue: this.bindingValueHelper[index],
        applicationProduct: this.applicationProductData[index],
      };
      this.creditProposalData.collateralProductRelations.push(tempCollateralProductRelationObject);
    } else if (event.checked === false) {
      if (this.creditProposalData.collateralProductRelations.length > 0) {
        for (let i = 0; i < this.creditProposalData.collateralProductRelations.length; i++) {
          if (
            this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralInfo.id &&
            this.creditProposalData.collateralProductRelations[i].applicationProduct === this.applicationProductData[index]
          ) {
            this.creditProposalData.collateralProductRelations.splice(i);
          }
        }
      }
    }

    this.outputCreditProposalMappingData.emit(this.creditProposalData);
  }
}

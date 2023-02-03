import { Component, Inject, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { Router } from '@angular/router';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-mapping-facility-history',
  templateUrl: './mapping-facility.component.html',
})
export class MappingFacilityHistoryComponent implements OnInit, OnChanges {
  @Output() outputCreditProposalMappingData = new EventEmitter();
  @Input() creditProposal: ICreditProposal;
  @Input() collateralData: ICollateral;

  @Input() isViewSabled: Boolean = false;
  @Input() isUseHistory: Boolean = false;

  public collateralInfo: any;
  public creditProposalData: any;
  public applicationProductData: any;
  public checked: boolean;
  public disableField: any;
  public field: boolean;

  public displayColumns: string[] = ['no', 'applicationType', 'facilityType', 'subLimit', 'currency', 'bindingValue', 'select'];

  public bindingValueHelper: any = [];
  public mappingStatusHelper: any = [];

  public parsedData: any;

  public dynamicData: any;
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
    this.parsedData = parsePreviousAtrribute(this.creditProposalData);
    this.dynamicData = this.isUseHistory
      ? this.parsedData.previousHistory.creditProposalCollateralData.crossCollateralStatus
      : this.parsedData.previousReturn.creditProposalCollateralData.crossCollateralStatus;
    console.log({
      isuse: this.isUseHistory,
      parse: this.parsedData.previousHistory.creditProposalCollateralData.crossCollateralStatus,
      attr: this.parsedData.previousHistory,
      test: this.parsedData['previousHistory']['collateralProductRelations'],
      dynamic: this.dynamicData,
    });
    if (this.dynamicData === 'Yes') {
      this.field === false;
    } else {
      this.field === true;
    }
  }

  public setCrossCollateral(index: number) {
    if (this.collateralData) {
      if (this.dynamicData === 'Yes') {
        const tempCollateralProductRelationObject = {
          collateralId: this.collateralInfo.id,
          bindingValue: this.bindingValueHelper[index],
          applicationProduct: this.applicationProductData[index],
        };
        this.isUseHistory
          ? this.parsedData.previousHistory.collateralProductRelations.push(tempCollateralProductRelationObject)
          : this.parsedData.previousReturn.collateralProductRelations.push(tempCollateralProductRelationObject);
      }
    }
  }

  private setUp(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposalData);
    if (this.applicationProductData.length > 0) {
      for (let i = 0; i < this.applicationProductData.length; i++) {
        this.bindingValueHelper.push(0);
        this.mappingStatusHelper.push('no');
        this.setCrossCollateral(i);
        if (this.parsedData.previousHistory) {
          if (this.parsedData.previousHistory.collateralProductRelations.length > 0) {
            for (let j = 0; j < this.parsedData.previousHistory.collateralProductRelations.length; j++) {
              if (
                this.parsedData.previousHistory.collateralProductRelations[j].collateralId === this.collateralInfo.id &&
                this.parsedData.previousHistory.collateralProductRelations[j].applicationProduct.id === this.applicationProductData[i].id
              ) {
                this.bindingValueHelper[i] = this.parsedData.previousHistory.collateralProductRelations[j].bindingValue;
                this.mappingStatusHelper[i] = 'yes';
              }
            }
          }
        }
      }
    }
  }

  public onChangeBindingValue(event: any, index: number): void {
    if (this.parsedData.previousHistory.collateralProductRelations.length > 0) {
      for (let i = 0; i < this.parsedData.previousHistory.collateralProductRelations.length; i++) {
        if (
          this.parsedData.previousHistory.collateralProductRelations[i].collateralId === this.collateralInfo.id &&
          this.parsedData.previousHistory.collateralProductRelations[i].applicationProduct.id === this.applicationProductData[index].id
        ) {
          this.parsedData.previousHistory.collateralProductRelations[i].bindingValue = event;
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
            this.creditProposalData.collateralProductRelations[i].applicationProduct.id === this.applicationProductData[index].id
          ) {
            this.creditProposalData.collateralProductRelations.splice(i, 1);
          }
        }
      }
    }

    this.outputCreditProposalMappingData.emit(this.creditProposalData);
  }
}

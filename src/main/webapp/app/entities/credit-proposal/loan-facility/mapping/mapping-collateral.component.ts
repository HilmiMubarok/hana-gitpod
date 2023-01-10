import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { DataSource } from '@angular/cdk/collections';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-mapping-collateral',
  templateUrl: './mapping-collateral.component.html',
})
export class CreditProposalMappingCollateralComponent implements OnInit {
  @Output() outputCreditProposalMappingData = new EventEmitter();

  public collateralInfo: any;
  public dataSource: any;
  public creditProposalData: ICreditProposal;
  public applicationProductData: any;
  public disabled = true;

  public displayColumns: string[] = ['no', 'collateralType', 'address', 'lvInternal', 'mvInternal', 'bindingValue', 'select'];

  public bindingValueHelper: any = [];
  public mappingStatusHelper: any = [];
  public disableField: any;
  public field = false;

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
      collateralInfo: ICollateral;
      collateralProductRelations: any; // seharusnya ICollateralProductRelation
      creditProposaldata: ICreditProposal;
      hideField: string;
    },
    protected collateralPropertyService: CollateralPropertyService
  ) {
    this.collateralInfo = this.data.collateralInfo;

    this.applicationProductData = this.data.applicationProduct;
    this.creditProposalData = this.data.creditProposaldata;
    this.disableField = this.data.hideField;
    this.setUp();
  }

  ngOnInit(): void {
    if (this.applicationProductData.id === undefined) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    for (let i = 0; i < this.collateralInfo.length; i++) {
      this.loadData(i);
    }
    this.sableFeild();
  }
  public sableFeild() {
    if (
      this.creditProposalData.statusId === 'CP_APPROVAL_BM' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_SME_HEAD' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_SDH' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_DH' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_DEPTHEAD'
    ) {
      this.field = true;
    }
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
              this.mappingStatusHelper[i] = 'yes';
              this.bindingValueHelper[i] = this.creditProposalData.collateralProductRelations[j].bindingValue;
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

  public loadData(i: number) {
    let data: ICollateralProperty;
    this.collateralPropertyService
      .queryFilterBy({
        page: 0,
        idCollateral: this.collateralInfo[i].id,
        idPropertyType: 'GENERAL',
        size: 9999,
      })
      .subscribe(res => {
        data = res.body.find(obj => obj.external === false);
        console.log(data);
        if (data !== undefined) {
          if (this.collateralInfo[i].collateralTypeId === 'VEHICLE') {
            this.collateralInfo[i].marketValueMaping = data.vehicleMarketValue;
          }
          if (this.collateralInfo[i].collateralTypeId === 'MACHINE') {
            this.collateralInfo[i].marketValueMaping = data.machineMarketValue;
          }
          if (this.collateralInfo[i].collateralTypeId === 'PROPERTY' || this.collateralInfo[i].collateralTypeId === 'REALESTATE') {
            this.collateralInfo[i].marketValueMaping = data.propertyMarketValue;
          }
          if (
            this.collateralInfo[i].collateralTypeId === 'LETTER_OF_GUARANTY' ||
            this.collateralInfo[i].collateralTypeId === 'DEPOSIT' ||
            this.collateralInfo[i].collateralTypeId === 'SECURITIES' ||
            this.collateralInfo[i].collateralTypeId === 'OTHER'
          ) {
            this.collateralInfo[i].marketValueMaping = data.marketValue;
          }
          this.collateralInfo[i].liquidationValueMaping = data.liquidationValue;
        } else {
          this.collateralInfo[i].marketValueMaping = 0;
          this.collateralInfo[i].liquidationValueMaping = 0;
        }
        if (this.collateralInfo[i].marketValueMaping === null) {
          this.collateralInfo[i].marketValueMaping = 0;
        }
        if (this.collateralInfo[i].liquidationValueMaping === null) {
          this.collateralInfo[i].liquidationValueMaping = 0;
        }
      });
  }
}

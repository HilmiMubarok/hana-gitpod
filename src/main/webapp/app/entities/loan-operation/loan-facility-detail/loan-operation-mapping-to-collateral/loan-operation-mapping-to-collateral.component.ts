import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-loan-operation-mapping-to-collateral',
  templateUrl: './loan-operation-mapping-to-collateral.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/mapping/mapping-facility.style.css'],
})
export class LoanOperationMappingToCollateralComponent implements OnInit {
  @Output() outputCreditProposalMappingData = new EventEmitter();

  public collateralData: any;
  public collateralInfo: any;
  public dataSource: any;
  public creditProposalData: ICreditProposal;
  public applicationProductData: any;
  public disabled = true;
  public collateralProperties: ICollateralProperty[];
  public displayColumns: string[] = ['no', 'collateralType', 'address', 'lvInternal', 'mvInternal', 'bindingValue', 'select'];

  public bindingValueHelper: any = [];
  public mappingStatusHelper: any = [];
  public disableField: any;
  public field = false;
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;
  public isLabel: boolean;
  public isElement: boolean;

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
      collateralInfo: ICollateral;
      collateralProductRelations: any; // seharusnya ICollateralProductRelation
      creditProposaldata: ICreditProposal;
      hideField: string;
      isLabel: boolean;
      isElement: boolean;
    },
    protected collateralPropertyService: CollateralPropertyService,
    protected activatedRoute: ActivatedRoute,
    private cashCollateralService: CashCollateralService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
    this.collateralInfo = this.data.collateralInfo;
    this.collateralProperties = [];
    this.applicationProductData = this.data.applicationProduct;
    this.creditProposalData = this.data.creditProposaldata;
    this.disableField = this.data.hideField;
    this.isLabel = this.data.isLabel;
    this.isElement = this.data.isElement;
    for (let i = 0; i < this.creditProposalData.collaterals.length; i++) {
      const collateral = this.creditProposalData.collaterals[i];
    }
  }

  ngOnInit(): void {
    const filterCollateral = this.collateralInfo.filter(obj => obj.statusId !== 'CANCEL');
    this.collateralData = filterCollateral.filter(o => o.collateralTypeId !== 'CASH');
    this.setUp();
    if (this.creditProposalData.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposalData.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposalData.prospectOrganization.id);
    }
    if (this.applicationProductData.id === undefined) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    for (let i = 0; i < this.collateralInfo.length; i++) {
      this.loadData(i);
    }
    this.sableFeild();
    console.log('ini parent path', this.parentPath);
  }
  public sableFeild() {
    if (
      this.creditProposalData.statusId === 'CP_APPROVAL_BM' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_SME_HEAD' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_SDH' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_DH' ||
      this.creditProposalData.statusId === 'CP_APPROVAL_DEPTHEAD' ||
      this.creditProposalData.statusId === 'CP_ASSIGNMENT'
    ) {
      this.field = true;
    }
    // Codition Mapping Collateral Disabled From Binding Value in credit agreement
    if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      // this.parentPath === 'dar-revision' ||
      this.parentPath === 'dar-revision-checker' ||
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'review-dppk'
    ) {
      // Default Disabled
      this.field = true;
    }
  }

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
  }

  public getCurrency(collateral: ICollateral) {
    let data: ICollateralProperty;
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data) {
        if (data.attributes.marketValueCcy === undefined) {
          if (
            collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
            collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
            collateral.collateralTypeId === COLLATERAL_TYPE['realestate']
          ) {
            if (data.attributes.marketValueOriginalCcy === undefined) {
              return 'IDR';
            } else {
              return data.attributes.marketValueOriginalCcy;
            }
          }
          return '';
        }
        return data.attributes.marketValueCcy;
      }
    }
    return 'IDR';
  }

  public countMVOriginal(collateral: ICollateral): number {
    let result: string;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    if (collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.amount === null || data.attributes.amount === undefined) {
          return 0;
        } else {
          return data.attributes.amount;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalProperty']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.collateralValue === null || data.attributes.collateralValue === undefined) {
          return 0;
        } else {
          return data.attributes.collateralValue;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.totalFaceAmount === null || data.attributes.totalFaceAmount === undefined) {
          return 0;
        } else {
          return data.attributes.totalFaceAmount;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.collateralValueOther === undefined || data.attributes.collateralValueOther === null) {
          return 0;
        } else {
          return data.attributes.collateralValueOther;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.amount === null || data.attributes.amount === undefined) {
          return 0;
        } else {
          return data.attributes.amount;
        }
      }
    }
    if (
      collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate']
    ) {
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
    result = 0;

    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.liquidationValue === null) {
          result = 0;
        } else {
          result = data.liquidationValue;
        }
      }
    }
    return result;
  }

  private setUp(): void {
    if (this.collateralData.length > 0) {
      for (let i = 0; i < this.collateralData.length; i++) {
        this.bindingValueHelper.push(0);
        this.mappingStatusHelper.push('no');
        if (this.creditProposalData.collateralProductRelations.length > 0) {
          for (let j = 0; j < this.creditProposalData.collateralProductRelations.length; j++) {
            if (
              this.creditProposalData.collateralProductRelations[j].collateralId === this.collateralData[i].id &&
              this.creditProposalData.collateralProductRelations[j].applicationProduct?.id === this.applicationProductData.id
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
          this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralData.id &&
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
        collateralId: this.collateralData[index].id,
        bindingValue: this.bindingValueHelper[index],
        applicationProduct: this.applicationProductData,
      };
      this.creditProposalData.collateralProductRelations.push(tempCollateralProductRelationObject);
    } else if (event.checked === false) {
      if (this.creditProposalData.collateralProductRelations.length > 0) {
        for (let i = 0; i < this.creditProposalData.collateralProductRelations.length; i++) {
          if (
            this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralData[index].id &&
            this.creditProposalData.collateralProductRelations[i].applicationProduct?.id === this.applicationProductData.id
          ) {
            this.creditProposalData.collateralProductRelations.splice(i);
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
        data = res.body.find(obj => obj.propertyType === 'GENERAL' && obj.collateralId && obj.external === true);
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
  public numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public countMV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
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
}

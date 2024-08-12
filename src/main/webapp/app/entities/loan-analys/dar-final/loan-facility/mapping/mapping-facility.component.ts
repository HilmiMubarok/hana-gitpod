import { Component, Inject, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import lodash from 'lodash';

@Component({
  selector: 'jhi-mapping-facility-temp',
  templateUrl: './mapping-facility.component.html',
})
export class MappingFacilityTempComponent implements OnChanges, OnInit {
  @Output() outputCreditProposalMappingData = new EventEmitter();
  @Output() changeButtonData = new EventEmitter();
  @Input() creditProposal: ICreditProposal;
  @Input() collateralData: ICollateral;
  @Input() isViewSabled: Boolean = false;
  @Input() isViewMode: Boolean = false;

  public collateralInfo: any;
  public creditProposalData: any;
  public applicationProductData: any;
  public checked: boolean;
  public disableField: any;
  public field: boolean;
  public propertieCGPG: ICollateralProperty[];
  public collateralCGPG: ICollateral[];
  public collateralProperties: ICollateralProperty[] = [];
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
      properties: ICollateralProperty[];
    },
    protected collateralService: CollateralService,
    protected collateralPropertyService: CollateralPropertyService
  ) {
    this.collateralInfo = this.data.collateral;
    this.applicationProductData = this.data.applicationProduct;
    this.creditProposalData = this.data.cp;
    this.setUp();
    this.checked = false;
    this.collateralProperties = this.data.properties;
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

    if (this.isViewMode === true) {
      this.field = true;
    } else if (this.isViewMode === false) {
      this.field = false;
    }

    this.sableFeild();
    this.disableFeild();

    // Disabled in compare data
    const params = new URLSearchParams(this.router.url.split('?')[1]);
    const subrouteValue = params.get('subroute');

    if (subrouteValue === 'compare-data') {
      this.field = true;
    }
    // Disabled in compare data
  }

  public disableFeild() {
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
  }
  public sableFeild() {
    this.disableField = this.router.url.split('/')[1];
    if (
      this.disableField === 'cp-status-approval' ||
      this.disableField === 'la-analyst' ||
      this.disableField === 'la-approval-inquiry' ||
      this.disableField === 'la-approval' ||
      this.disableField === 'la-SME-CRC' ||
      this.disableField === 'la-distribution' ||
      this.disableField === 'dar-checker' ||
      this.disableField === 'dar-notif' ||
      this.disableField === ' cc-distribution' ||
      this.disableField === 'cc-checking' ||
      this.disableField === 'cc-review' ||
      this.disableField === 'cc-inquiry' ||
      this.disableField === 'loan-analys-and-approval-monitoring' ||
      this.disableField === 'distribution' ||
      this.disableField === 'finalize' ||
      this.disableField === 'review' ||
      this.disableField === 'confirmation'
    ) {
      this.field = true;
    }
  }

  public setCrossCollateral(index: number) {
    if (this.collateralData) {
      if (this.collateralData.collateralTypeId !== 'CORPORATEPERSONALGUARANTEE') {
        if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
          const tempCollateralProductRelationObject = {
            collateralId: this.collateralInfo.id,
            bindingValue: this.bindingValueHelper[index],
            applicationProduct: this.applicationProductData[index],
            id: this.creditProposalData.collateralProductRelations[index].id,
          };
          this.creditProposalData.collateralProductRelations.push(tempCollateralProductRelationObject);
        }
      }
    }
  }

  private setUp(): void {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    if (this.applicationProductData.length > 0) {
      for (let i = 0; i < this.applicationProductData.length; i++) {
        this.bindingValueHelper.push(0);
        this.mappingStatusHelper.push('no');
        this.setCrossCollateral(i);
        if (this.creditProposalData.collateralProductRelations) {
          if (this.creditProposalData.collateralProductRelations.length > 0) {
            for (let j = 0; j < this.creditProposalData.collateralProductRelations.length; j++) {
              for (let k = 0; k < copyCreditProposal.collateralProductRelations.length; k++) {
                if (
                  this.creditProposalData.collateralProductRelations[j].collateralId === this.collateralInfo.id &&
                  this.creditProposalData.collateralProductRelations[j].applicationProduct?.id === this.applicationProductData[i].id &&
                  this.creditProposalData.collateralProductRelations[j].id === copyCreditProposal.collateralProductRelations[k].id
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
  }

  public onChangeBindingValue(event: any, index: number): void {
    if (this.creditProposalData.collateralProductRelations.length > 0) {
      for (let i = 0; i < this.creditProposalData.collateralProductRelations.length; i++) {
        if (
          this.creditProposalData.collateralProductRelations[i].collateralId === this.collateralInfo.id &&
          this.creditProposalData.collateralProductRelations[i].applicationProduct.id === this.applicationProductData[index].id
        ) {
          this.creditProposalData.collateralProductRelations[i].bindingValue = event;
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

  public changeButton(idx, event) {
    if (event.checked === true) {
      this.mappingStatusHelper[idx] = 'yes';
    } else if (event.checked === false) {
      this.mappingStatusHelper[idx] = 'no';
    }

    let sumTotalPlafond = 0;
    if (this.collateralData.collateralTypeId === 'CORPORATEPERSONALGUARANTEE') {
      const filterCgpg: ICollateralProperty[] = this.collateralProperties.filter(obj => obj.collateralId === this.collateralData.id);
      const findCgpg: ICollateralProperty = filterCgpg.find(obj => obj.external === false);
      const cgpgIdx = this.collateralProperties.findIndex(x => x.id === findCgpg.id);
      if (this.applicationProductData.length > 0) {
        for (let i = 0; i < this.applicationProductData.length; i++) {
          if (this.mappingStatusHelper[i] === 'yes') {
            if (this.applicationProductData[i].totalPlafond !== null) {
              if (this.applicationProductData[i].currencyId !== null) {
                if (this.applicationProductData[i].currencyId === 'IDR') {
                  sumTotalPlafond = sumTotalPlafond + Number(this.applicationProductData[i].totalPlafond);
                } else if (this.applicationProductData[i].currencyId === 'USD') {
                  sumTotalPlafond =
                    sumTotalPlafond + Number(this.applicationProductData[i].totalPlafond * this.applicationProductData[i].kurs);
                }
              }
            }
          }
        }
      }
      this.collateralProperties[cgpgIdx].marketValue = sumTotalPlafond;
      this.collateralProperties[cgpgIdx].marketValueOriginalAmt = sumTotalPlafond;
      this.collateralProperties[cgpgIdx].liquidationValue = sumTotalPlafond;
      this.collateralProperties[cgpgIdx].marketValueOriginalCcy = 'IDR';
      this.changeButtonData.emit();
    }
  }

  public getSublimit(element) {
    if (element === false) {
      return 'NO';
    }
    if (element === true) {
      return 'YES';
    }
    return '';
  }

  // private loadByPartyId(param: string): void {
  //   this.collateralService
  //     .queryFilterBy({
  //       idParty: param,
  //       isActive: true,
  //     })
  //     .subscribe(res => {
  //       this.collateralCGPG = res.body.filter(obj => obj.collateralTypeId === 'CORPORATEPERSONALGUARANTEE');
  //       console.log("collateral cgpg ", this.collateralCGPG);
  //       if(this.collateralCGPG.length > 0){
  //         for(let i = 0; i < this.collateralCGPG.length; i++){
  //           this.findCollateralProperty(this.collateralCGPG[i]);
  //         }
  //       }
  //     });
  // }

  // public findCollateralProperty(collateral: ICollateral): void {
  //   if (collateral.id) {
  //     this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
  //       this.collateralProperties = [...this.collateralProperties, ...res.body];
  //     });
  //   }
  // }
}

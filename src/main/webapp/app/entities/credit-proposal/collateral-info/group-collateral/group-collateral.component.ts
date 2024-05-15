import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE, COLLATERAL_BINDING_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalCollateralInfoDialogComponent } from '../dialog/credit-proposal-collateral-info-dialog.component';
import { CreditProposalService } from '../../credit-proposal.service';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IGroupCollateral } from 'app/shared/model/group-collateral.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGroupCollateralChecklis } from './group-collateral-total.model';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-group-collateral',
  templateUrl: './group-collateral.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class GroupCollateralComponent implements OnInit, OnChanges {
  @Input() isViewMode;
  public displayedColumns: string[] = [
    'select',
    'no',
    'collateralType',
    'collateralAddress',
    'mvInternalOriginal',
    'marketValue',
    'liquidValue',
    'mValueKjjp',
    'lValueKjjp',
    'marketability',
    'occupancy',
    'ownership',
    'certificateDueDate',
    'insuredtype',
    'insuredAmount',
    'bindingType',
    'bindingValue',
    'collateralStatus',
    'crossCollateral',
    'action',
  ];

  public groupChecklisCollaterals: IGroupCollateralChecklis[] = [];
  public certificateType: any;
  public dataItem: any;
  public dataCertyficate: any;
  private bindingTypeVal: any;
  public listGroupCollateral: ICollateral[];
  public _collateralProperty: ICollateralProperty[];
  public totalMVInt: number;
  public totalLVInt: number;
  private _creditProposal: ICreditProposal;
  private _partyId: string;
  public groupCollaterals: ICollateral[];
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public insuranceTypes = [];
  @Input()
  get collateralProperties() {
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }
  public bindingTypesHobies = [];
  @Input() cif: string;

  @Input()
  get partyId() {
    return this._partyId;
  }
  set partyId(partyId: string) {
    this._partyId = partyId;
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  private _group: string;

  @Input()
  get group() {
    return this._group;
  }
  set group(data: string) {
    this._group = data;
  }

  constructor(
    protected collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private partyCifService: PartyCifService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private generalParameterService: GeneralParameterService,
    private cashCollateralService: CashCollateralService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
  }

  ngOnInit(): void {
    this.getLovInsuranceType();
    this.setCertyficateType();
    this.lovBindingType();
    if (this.creditProposal.attributes['groupChecklisCollateral']) {
      while (typeof this.creditProposal.attributes['groupChecklisCollateral'] === 'string') {
        this.creditProposal.attributes['groupChecklisCollateral'] = JSON.parse(this.creditProposal.attributes['groupChecklisCollateral']);
        this.groupChecklisCollaterals = this.creditProposal.attributes['groupChecklisCollateral'];
      }
    } else {
      this.creditProposal.attributes['groupChecklisCollateral'] = [];
    }
    // this.creditProposalService.triggerChanggedColRelByCPObservable.subscribe(newCP => {
    //   this.checkIndividualCol(newCP);
    // });
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
  }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';

    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
        }
      }
    }
    if (changes['partyId']) {
      this.collateralMybusiness();
      this.findCollateralProperty(changes.partyId.currentValue);
    }
  }

  private findAndCleanConnection(): void {
    if (
      this.creditProposal.collateralProductRelations.length > 0 &&
      this.creditProposal.products.length > 0 &&
      this.groupCollaterals.length > 0
    ) {
      /* for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
    for (let j = 0; j < this.creditProposal.products.length; j++) {
      if (this.creditProposal.collateralProductRelations[i].applicationProduct.id === this.creditProposal.products[j].id && this.creditProposal.collateralProductRelations[i].collateralId === col.id) {
      this.creditProposal.collateralProductRelations.splice(i,1);
      }
    }
    } */
      // for (const [index, item] of this.creditProposal.collateralProductRelations.entries()) {
      for (let index = 0; index < this.creditProposal.collateralProductRelations.length; index++) {
        for (let j = 0; j < this.creditProposal.products.length; j++) {
          for (let k = 0; k < this.groupCollaterals.length; k++) {
            if (
              this.creditProposal.collateralProductRelations[index].applicationProduct.id === this.creditProposal.products[j].id &&
              this.creditProposal.collateralProductRelations[index].collateralId === this.groupCollaterals[k].id
            ) {
              this.creditProposal.collateralProductRelations.splice(index);
            }
          }
        }
      }
    }
  }
  public changeCheckedColGroupAssignToProdAll(event: MatCheckboxChange, index: number, element: ICollateral): void {
    this.groupChecklisCollaterals = this.creditProposal.attributes['groupChecklisCollateral'];
    if (this.creditProposal.products.length > 0 && this.groupCollaterals.length > 0) {
      const value: boolean = event.checked;
      if (value) {
        if (this.creditProposal.attributes['groupChecklisCollateral']) {
          const filter: IGroupCollateralChecklis = this.creditProposal.attributes['groupChecklisCollateral'].find(
            obj => obj.collateralId === element.id
          );
          if (filter) {
            const idx: number = lodash.findIndex(this.groupChecklisCollaterals, function (o) {
              return o.collateralId === element.id;
            });
            this.creditProposal.attributes['groupChecklisCollateral'][idx].checklis = true;
          } else {
            const checklis: IGroupCollateralChecklis = {};
            checklis.cifNumber = this.cif;
            checklis.checklis = true;
            checklis.collateralId = element.id;
            this.creditProposal.attributes['groupChecklisCollateral'].push(checklis);
          }
        }
        for (let j = 0; j < this.creditProposal.products.length; j++) {
          const tempCollateralProductRelationObject = {
            applicationProduct: this.creditProposal.products[j],
            collateralId: this.groupCollaterals[index].id,
            bindingValue: 0,
          };
          this.creditProposal.collateralProductRelations.push(tempCollateralProductRelationObject);
        }
      } else {
        this.groupChecklisCollaterals = this.creditProposal.attributes['groupChecklisCollateral'];
        const filter: IGroupCollateralChecklis = this.creditProposal.attributes['groupChecklisCollateral'].find(
          obj => obj.collateralId === element.id
        );
        if (filter) {
          const idx: number = lodash.findIndex(this.groupChecklisCollaterals, function (o) {
            return o.collateralId === element.id;
          });
          this.creditProposal.attributes['groupChecklisCollateral'][idx].checklis = false;
        }
        this.findAndCleanConnection();
        // do nothing; done by another function
        // this.creditProposalService.changeColRelByCP(this.creditProposal);
      }
    }
  }
  private checkIndividualCol(cp: ICreditProposal): void {
    if (cp.collateralProductRelations.length > 0 && cp.products.length > 0 && this.groupCollaterals.length > 0) {
      for (let k = 0; k < this.groupCollaterals.length; k++) {
        for (let i = 0; i < cp.collateralProductRelations.length; i++) {
          for (let j = 0; j < cp.products.length; j++) {
            if (
              cp.collateralProductRelations[i].applicationProduct.id === cp.products[j].id &&
              cp.collateralProductRelations[i].collateralId === this.groupCollaterals[k].id
            ) {
              this.groupCollaterals[k].attributes['crossCollateral'] = 'yes';
            } else {
              this.groupCollaterals[k].attributes['crossCollateral'] = 'no';
            }
          }
        }
      }
    }
  }

  public openDialog(element: ICollateral): void {
    let cp = {};
    for (let index = 0; index < this.creditProposal.collaterals.length; index++) {
      if (this.creditProposal.collaterals[index].collateralId === element.collateralId) {
        cp = this.creditProposal;
      }
    }
    const predicate: object = {
      width: '80vw',
      data: {
        cp: this.creditProposal,
        collateral: element,
        marketability: this.getMarketability(),
        internalMV: this.countMV(element),
        internalLV: this.countLV(element),
        externalMV: this.countKJJPMV(element),
        externalLV: this.countKJJPLV(element),
        properties: this.filterProperties(element),
        binding: this.getBinding(element),
        insurance: this.getInsurance(element),
        applicationProduct: this.creditProposal.products,
        matrikBindingType: this.getBindingType(element.collBindingType),
        ownerShip: this.findCertyficate(element) + ' ' + this.getOwnerShip(element),
        certDueDate: this.getExpiry(element),
        isViewMode: false,
        group: this.group,
      },
    };
    const dialogRef = this.dialog.open(CreditProposalCollateralInfoDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        /* if (res.action === 'cancel') {
          this.creditProposal.collateralProductRelations = res.creditProposal.collateralProductRelations;
        } */
        this.creditProposalService.changeColRelByCP(res.creditProposal);

        const collateralIdx: number = lodash.findIndex(this.creditProposal.collaterals, function (o) {
          return o.id === res['collateral'].id;
        });

        if (collateralIdx > -1) {
          this.creditProposal.collaterals[collateralIdx] = res['collateral'];
        }

        // replace / add binding
        const bindingIdx: number = lodash.findIndex(
          this.creditProposal.attributes['binding'],
          function (o: ICreditProposalCollateralBinding) {
            return o.collateralId === res['collateral'].id;
          }
        );

        if (bindingIdx > -1) {
          this.creditProposal.attributes['binding'][bindingIdx] = res['binding'];
        } else {
          this.creditProposal.attributes['binding'] = [...this.creditProposal.attributes['binding'], res['binding']];
        }

        // replace / add insurance
        const insuranceIdx: number = lodash.findIndex(
          this.creditProposal.attributes['insurance'],
          function (o: ICreditProposalCollateralInsurance) {
            return o.collateralId === res['collateral'].id;
          }
        );

        if (insuranceIdx > -1) {
          this.creditProposal.attributes['insurance'][insuranceIdx] = res['insurance'];
        } else {
          this.creditProposal.attributes['insurance'] = [...this.creditProposal.attributes['insurance'], res['insurance']];
        }
      }
    });
  }

  countKJJPLV(collateral: ICollateral) {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    result = 0;

    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
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

  countKJJPMV(collateral: ICollateral) {
    let result: number;
    result = 0;
    let data: ICollateralProperty;
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          result = 0;
        } else {
          result = data.marketValue;
        }
      }
    }
    return result;
  }

  public getCertificationDate(collateral: ICollateral): string {
    const properties: ICollateralProperty[] = this.filterProperties(collateral);
    return this.creditProposalService.getCertificationDate(collateral, properties);
  }

  public getMarketability(): string {
    if (this.creditProposal.appraisals.length > 0) {
      const lastAppraisal: ICollateralAppraisal = this.creditProposal.appraisals[this.creditProposal.appraisals.length - 1];
      if (lodash.has(lastAppraisal.attributes, 'summary')) {
        return JSON.parse(lastAppraisal.attributes['summary']).marketbility;
      }
    }
    return 'N/A';
  }

  private getInsurance(element: ICollateral): ICreditProposalCollateralInsurance {
    if (this.creditProposal.attributes['insurance'].length > 0) {
      for (let i = 0; i < this.creditProposal.attributes['insurance'].length; i++) {
        const item: ICreditProposalCollateralInsurance = this.creditProposal.attributes['insurance'][i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }

    return new CreditProposalCollateralInsurance();
  }
  getLovInsuranceType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        // console.log('insurance type body ', res.body);
        this.insuranceTypes = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getInsuranceType(value) {
    if (this.insuranceTypes) {
      const data = this.insuranceTypes.find(obj => obj.code === value);
      if (data) {
        return data.value;
      }
    }
    return '';
  }
  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypesHobies = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }
  public getBindingType(element: string) {
    if (this.bindingTypesHobies) {
      const data = this.bindingTypesHobies.find(obj => obj.code === element);
      if (data) {
        return data.value;
      }
    }
    return '';
  }

  private getBinding(element: ICollateral): ICreditProposalCollateralBinding {
    if (this.creditProposal.attributes['binding'].length > 0) {
      for (let i = 0; i < this.creditProposal.attributes['binding'].length; i++) {
        const item: ICreditProposalCollateralBinding = this.creditProposal.attributes['binding'][i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }

    return new CreditProposalCollateralBinding();
  }

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
  }

  private filterProperties(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];

    properties = [];

    // for machine
    if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
      properties = lodash.filter(this.collateralProperties, function (o) {
        return o.collateralId === collateral.id;
      });
    }

    return properties;
  }

  public getCurrency(collateral: ICollateral) {
    let data: ICollateralProperty;
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data) {
        if (data.marketValueOriginalCcy === undefined || data.marketValueOriginalCcy === null) {
          return '';
        }
        return data.marketValueOriginalCcy;
      }
    }
    return 'IDR';
  }

  public countMVOriginal(collateral: ICollateral): number {
    let result: string;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
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
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValueOriginalAmt === null) {
          return 0;
        } else {
          return data.marketValueOriginalAmt;
        }
      }
    }
    return 0;
  }
  private filterPropertiesFilterGurante(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];

    // for machine
    if (collateral.collateralTypeId !== 'CORPORATEPERSONALGUARANTEE') {
      if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
        properties = lodash.filter(this.collateralProperties, function (o) {
          return o.propertyType === 'GENERAL' && o.collateralId === collateral.id;
        });
      }
    }

    return properties;
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

  public countTotalLV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.groupCollaterals;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.liquidationValue);
          }
        }
      }
    }
    this.creditProposal.attributes['collateralGroup'].totalLV = result;
    return result;
  }

  public countTotalMV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.groupCollaterals;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.marketValue);
          }
        }
      }
    }
    this.creditProposal.attributes['collateralGroup'].totalMV = result;
    return result;
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

  public countTotalMVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.groupCollaterals;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined && collaterals[i].collateralTypeId) {
            result = result + data.marketValue;
          }
        }
      }
    }
    this.creditProposal.attributes['collateralGroup'].totalMVKJJP = result;
    return result;
  }

  public countTotalLVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.groupCollaterals;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined) {
            result = result + data.liquidationValue;
          }
        }
      }
    }
    this.creditProposal.attributes['collateralGroup'].totalLvKJJP = result;
    return result;
  }

  public groubCollateralPagination: any;

  public collateralMybusiness() {
    // const groupId = this.creditProposal.debtorData.groupCompanyId;
    // const idParty = this.creditProposal.cif.partyId;
    // const cifNumber = this.creditProposal.customerNumber;

    this.collateralService
      .queryFilterBy({
        idParty: this._partyId,
        isActive: true,
      })
      .subscribe(res => {
        this.groupCollaterals = res.body;
        if (this.creditProposal) {
          this.checkIndividualCol(this.creditProposal);
        }
        this.groubCollateralPagination = new MatTableDataSource(this.groupCollaterals);
        this.groubCollateralPagination.paginator = this.paginator;
      });
    /* this.partyCifService.getListGroupCollateral(cifNumber).subscribe(res => {
      this.groupCollaterals = res.body;
    this.checkIndividualCol();
      this.mapCollateralProperty(res.body);
      this.groubCollateralPagination = new MatTableDataSource(this.groupCollaterals);
      this.groubCollateralPagination.paginator = this.paginator;
    }); */
  }

  public getCrossStatus(status: string) {
    if (status === 'N') {
      return 'NO';
    }
    if (status === 'Y') {
      return 'YES';
    }
    if (status === undefined) {
      return '';
    }
    return '';
  }

  public setCertyficateType() {
    this.partyCifService.getCertificate().subscribe(res => {
      this.certificateType = res.body;
    });
  }

  public findCertyficate(collateral) {
    let data: ICollateralProperty;

    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateType !== undefined) {
          if (this.certificateType) {
            this.dataCertyficate = this.certificateType.find(obj => obj.id === data.attributes.certificateType);
            if (this.dataCertyficate) {
              return this.dataCertyficate.label;
            }
            return '';
          }
        }
      }
    }
    return '';
  }

  public getOwnerShip(collateral: ICollateral) {
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    let string1: string;
    let string2: string;
    let result: string;

    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateNumber === undefined) {
          string2 = '';
        } else {
          string2 = data.attributes.certificateNumber;
        }
      }
    }
    return string2;
  }

  public getExpiry(collateral: ICollateral) {
    let result: any;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];

    if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['other']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.expiry === undefined) {
          result = '';
        } else {
          result = data.attributes.expiry;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateExpiryDate === undefined) {
          result = '';
        } else {
          result = data.attributes.certificateExpiryDate;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['securities'] || collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.maturityDate === undefined) {
          result = '';
        } else {
          result = data.attributes.maturityDate;
        }
      }
    }
    return result;
  }

  public disabledCeklis(event) {
    if (event.collateralTypeId === 'CORPORATEPERSONALGUARANTEE') {
      return true;
    }
    return false;
  }

  public getDataCeklis(element) {
    const data: IGroupCollateralChecklis = this.creditProposal.attributes['groupChecklisCollateral'].find(
      obj => obj.collateralId === element.id
    );
    if (data) {
      return data.checklis;
    }
    return false;
  }
}

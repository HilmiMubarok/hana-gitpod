import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CollateralInfoDialogTempComponent } from '../dialog/collateral-info-dialog-temp.component';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Subject, takeUntil } from 'rxjs';
import { CollateralPropertyResultListComponent } from 'app/entities/collateral-property/collateral-property-result-list.component';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-above-grid-dar-final',
  templateUrl: './above-grid.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class AboveGridDarFinalComponent
  extends AbstractEntityMaterialComponent<ICollateral>
  implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
  public displayedColumns: string[] = [
    'no',
    // 'id',
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

  public collateralStartState: ICollateral;
  public creditProposalStartState: ICreditProposal;
  public dataCollateral: ICollateral[];
  public certificateType: any;
  public dataItem: any;
  public dataCertyficate: any;
  private bindingTypeVal: any;
  private facilityTypes: any;
  public totalMVInt: number;
  public totalLVInt: number;
  private _creditProposal: ICreditProposal;
  public biddingValueSum: number;
  public biddingValueCoverage: number;
  private _collateralProperties: ICollateralProperty[];
  public dataCollateralSummary: any[];

  public selectedMenu: string;
  public isChecked: boolean;
  public totalPlafond: number;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperties;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperties = item;
  }

  public presentage(value: string, status: string) {
    // console.log('cekd', value);
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      if (status === 'mv') {
        this.creditProposal.attributes.coverageTotal.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.coverageTotal.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.coverageTotal.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.coverageTotal.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      if (status === 'mv') {
        this.creditProposal.attributes.coverageTotal.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.coverageTotal.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.coverageTotal.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.coverageTotal.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else {
      if (status === 'mv') {
        this.creditProposal.attributes.coverageTotal.mvInternalCoverage = num;
      } else if (status === 'lv') {
        this.creditProposal.attributes.coverageTotal.lvInternalCoverage = num;
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.coverageTotal.mvKjjpCoverage = num;
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.coverageTotal.lvKjjpCoverage = num;
      }
      return num + 'x';
    }
  }

  @Input() isViewMode;

  constructor(
    protected _snackbar: MatSnackBar,
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private partyCifService: PartyCifService,
    private cashCollateralService: CashCollateralService,
    private router: Router
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === '') {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }

    // this.isViewMode && this.displayedColumns.pop();

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
    this.setCertyficateType();
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
  }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  private loadByPartyId(param: string): void {
    console.log('Load by party id');
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 999,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.getBindingCalculate(res.body);
        this.dataCollateral = res.body;
        console.log({ resbody: res.body });
        this.dataItem = new MatTableDataSource(res.body);
        this.dataItem.paginator = this.paginator;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.customerType === 'PERSONAL') {
        this.loadByPartyId(this.creditProposal.prospectPerson.id);
      } else {
        this.loadByPartyId(this.creditProposal.prospectOrganization.id);
      }
    }
  }

  public dynamicCollateral() {
    if (this.creditProposal.attributes['darRevHistory']) {
      return parsePreviousAtrribute(this.creditProposal)['darRevHistory'].collaterals;
    } else {
      return this.creditProposal.collaterals;
    }
  }

  public collateral: any;
  ngAfterViewInit(): void {
    let a = [];
    for (let i = 0; i < this.dynamicCollateral().length; i++) {
      a = lodash.concat(a, this.dynamicCollateral()[i]);
    }
    this.collateral = new MatTableDataSource(a);
    this.collateral.paginator = this.paginator2;
  }

  public openDialog(element: ICollateral): void {
    this.collateralStartState = lodash.cloneDeep(element);
    this.creditProposalStartState = lodash.cloneDeep(this.creditProposal);
    let cp = {};
    for (let index = 0; index < this.dynamicCollateral().length; index++) {
      if (this.dynamicCollateral()[index].collateralId === element.collateralId) {
        cp = this.creditProposal;
      }
    }
    const predicate: object = {
      width: '80vw',
      data: {
        cp: this.creditProposal,
        collateral: element,
        marketability: this.getMarketability(element),
        internalMV: this.countMV(element),
        internalLV: this.countLV(element),
        externalMV: this.countKJJPMV(element),
        externalLV: this.countKJJPLV(element),
        properties: this.filterProperties(element),
        binding: this.getBinding(element),
        insurance: this.getInsurance(element),
        certDueDate: this.getExpiry(element),
        ownerShip: this.findCertyficate(element) + ' ' + this.getOwnerShip(element),
        applicationProduct: this.creditProposal.products,
        matrikBindingType: this.getBindingType(element.collBindingType),
      },
    };
    const dialogRef = this.dialog.open(CollateralInfoDialogTempComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const collateralIdx: number = lodash.findIndex(this.dynamicCollateral(), function (o: ICollateral) {
          return o.id === res['collateral'].id;
        });
        if (collateralIdx > -1) {
          this.dynamicCollateral()[collateralIdx] = res['collateral'];
          const filter = this.dynamicCollateral().filter(obj => obj.statusId !== 'CANCEL' && obj.statusId !== 'RELEASE');
          this.dataItem = new MatTableDataSource(filter);
          this.dataItem.paginator = this.paginator;
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
        this.loadByPartyId(this.creditProposal.cif.partyId);
        this.save().then(() => {
          this.loadSummaryCollateralSummary().then(() => {
            this.getSummaryCollateral().then(() => {
              this.presentageSummary(String(this.countTotalMVSummary() / this.totalPlafond), 'mv');
              this.presentageSummary(String(this.countTotalLVSummary() / this.totalPlafond), 'lv');
              this.presentageSummary(String(this.countTotalMVKJJPSummary() / this.totalPlafond), 'mvKjjp');
              this.presentageSummary(String(this.countTotalLVKJJPSummary() / this.totalPlafond), 'lvKjjp');
              this.save();
            });
          });
        });
      } else {
        const collateralIdx: number = lodash.findIndex(this.dynamicCollateral(), (o: ICollateral) => o.id === this.collateralStartState.id);
        if (collateralIdx > -1) {
          this.dynamicCollateral()[collateralIdx] = this.collateralStartState;
          const filter = this.dynamicCollateral().filter(obj => obj.statusId !== 'CANCEL' && obj.statusId !== 'RELEASE');
          this.dataItem = new MatTableDataSource(filter);
          this.dataItem.paginator = this.paginator;
        }
        const bindingIdx: number = lodash.findIndex(
          this.creditProposal.attributes['binding'],
          (o: ICreditProposalCollateralBinding) => o.collateralId === this.collateralStartState.id
        );
        if (bindingIdx > -1) {
          this.creditProposal.attributes['binding'][bindingIdx] = this.creditProposalStartState.attributes['binding'][bindingIdx];
        }
        const insuranceIdx: number = lodash.findIndex(
          this.creditProposal.attributes['insurance'],
          (o: ICreditProposalCollateralInsurance) => o.collateralId === this.collateralStartState.id
        );
        if (insuranceIdx > -1) {
          this.creditProposal.attributes['insurance'][insuranceIdx] = this.creditProposalStartState.attributes['insurance'][insuranceIdx];
        }
        this.save().then(() => {
          this.loadSummaryCollateralSummary().then(() => {
            this.getSummaryCollateral().then(() => {
              this.presentageSummary(String(this.countTotalMVSummary() / this.totalPlafond), 'mv');
              this.presentageSummary(String(this.countTotalLVSummary() / this.totalPlafond), 'lv');
              this.presentageSummary(String(this.countTotalMVKJJPSummary() / this.totalPlafond), 'mvKjjp');
              this.presentageSummary(String(this.countTotalLVKJJPSummary() / this.totalPlafond), 'lvKjjp');
              this.save();
            });
          });
        });
      }
    });
  }
  countKJJPLV(collateral: ICollateral) {
    let result: number;
    let data: ICollateralProperty;
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

  public getMarketability(collateral): string {
    let data: ICollateralProperty;
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketability === undefined || data.marketability === null) {
          return 'N/A';
        } else {
          return data.marketability;
        }
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

    // for machine
    if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
      properties = lodash.filter(this.collateralProperties, function (o) {
        return o.propertyType === 'GENERAL' && o.collateralId === collateral.id;
      });
    }

    return properties;
  }

  public countLV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
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

  public countTotalLV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    return result;
  }

  public countTotalMV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    return result;
  }

  public countMV(collateral: ICollateral): number {
    let data: ICollateralProperty;
    // console.log("collateral in above grid",collateral);
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

  fungsiSumcredit(value: string): Promise<void> {
    return new Promise<void>(resolve => {
      let result: number;
      let dolar: number;
      let filterIdr = [];
      let filterUsd = [];
      result = 0;
      dolar = 0;

      const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

      if (dataFilter.length > 0) {
        if (value === 'USD' || value === 'both') {
          filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
        }

        if (value === 'IDR' || value === 'both') {
          filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
        }

        if (value === 'IDR' || value === 'both') {
          if (filterIdr.length > 0) {
            for (let i = 0; i < filterIdr.length; i++) {
              if (filterIdr[i].totalPlafond !== undefined) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
          }
        }

        if (value === 'USD') {
          if (filterUsd.length > 0) {
            for (let i = 0; i < filterUsd.length; i++) {
              if (filterUsd[i].totalPlafond !== undefined) {
                dolar = dolar + Number(filterUsd[i].totalPlafond);
              }
            }
          }
        }

        if (value === 'both') {
          if (filterUsd.length > 0) {
            for (let i = 0; i < filterUsd.length; i++) {
              if (filterUsd[i].totalPlafond !== undefined) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
          }
        }
      }
      if (value === 'both') {
        this.creditProposal.attributes['facilityDetail'].totalPlafond = result + dolar;
      }
      if (value === 'USD') {
        this.creditProposal.attributes['facilityDetail'].totalPlafondUsd = result + dolar;
      }
      if (value === 'IDR') {
        this.creditProposal.attributes['facilityDetail'].totalPlafondIdr = result + dolar;
      }

      const creditLimit = result + dolar;
      this._creditProposal.attributes['coverageTotal'].creditLimit = creditLimit;

      this.totalPlafond = result + dolar;

      resolve();
    });
  }

  public countMVOriginal(collateral: ICollateral): number {
    let data: ICollateralProperty;
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

  public countTotalMVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    return result;
  }

  public countTotalLVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    return result;
  }

  // get Ownership
  public getOwnerShip(collateral: ICollateral) {
    let data: ICollateralProperty;
    let string2: string;

    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId !== COLLATERAL_TYPE['personalCorporateGuarantee']) {
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
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.certificateNumber === undefined || data.certificateNumber === null) {
          string2 = '';
        } else {
          string2 = data.certificateNumber;
        }
      }
    }
    return string2;
  }

  public getExpiry(collateral: ICollateral) {
    let result: any;
    let data: ICollateralProperty;

    // console.log("collateral in above grid",collateral);
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
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.certificateExpiryDate === undefined) {
          result = '';
        } else {
          result = data.certificateExpiryDate;
        }
      }
    }
    return result;
  }

  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }
  public slideChange($event) {
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
      if (this.dynamicCollateral()?.length > 0 && this.creditProposal.products?.length > 0) {
        for (let i = 0; i < this.dynamicCollateral().length; i++) {
          for (let j = 0; j < this.creditProposal.products.length; j++) {
            if ($event === true) {
              const tempCollateralProductRelationObject = {
                collateralId: this.dynamicCollateral()[i].id,
                bindingValue: 0,
                applicationProduct: this.creditProposal.products[j],
              };
              this.creditProposal.collateralProductRelations.push(tempCollateralProductRelationObject);
            }
          }
        }
      }
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
      if (this.creditProposal.collateralProductRelations.length > 0) {
        for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
          if (
            this.creditProposal.collateralProductRelations[i].collateralId === this.dynamicCollateral()[i]?.id &&
            this.creditProposal.collateralProductRelations[i].applicationProduct?.id === this.creditProposal.products[i]?.id
          ) {
            this.creditProposal.collateralProductRelations.splice(i, this.creditProposal.collateralProductRelations.length);
          }
        }
      }
    }
  }

  public getBindingType(element: string) {
    const keyy = Object.keys(this.bindingTypeVal).find(item => item === element);
    return this.bindingTypeVal[keyy];
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
    this.partyCifService
      .getCertificate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.certificateType = res.body;
      });
  }

  public findCertyficate(collateral) {
    let data: ICollateralProperty;

    // console.log("collateral in above grid",collateral);
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

  public getBindingCalculate(res: any[]) {
    const array1 = res;
    const array2 = this.creditProposal.attributes['binding'];
    let getBindingCalculateValue;
    const data = [];
    array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
      data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
      getBindingCalculateValue = data.filter(item => item !== undefined);
      this.fungsiSumcredit('both').then(() => {
        this.biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
        const biddingValueCoverage = this.convertNan(Number(this.biddingValueSum) / Number(this.totalPlafond));

        this.biddingValueCoverage = biddingValueCoverage.toFixed(2);
        this.creditProposal.attributes['coverageTotal'].biddingValueSum = this.biddingValueSum;
        this.creditProposal.attributes['coverageTotal'].biddingValueCoverage = this.biddingValueCoverage;
      });
    });
  }

  public convertNan(value: any): any {
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }
  }

  public getCcyBinding(element) {
    if (element) {
      return element;
    }
    return '';
  }

  public filterNull(value) {
    if (value !== null || value !== undefined) {
      return value;
    }
    return 0;
  }

  public presentageSummary(value: string, status: string) {
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = num;
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = num;
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = num;
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = num;
      }
      return num + 'x';
    }
  }
  public getSummaryCollateral() {
    return new Promise((resolve, reject) => {
      const applicationNumber = this.creditProposal.id;
      this.collateralService.getSummaryCollateral(applicationNumber, { page: 0, size: 9999 }).subscribe(
        res => {
          this.dataCollateralSummary = lodash.filter(res.body, function (o) {
            return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
          });
          resolve(this.dataCollateralSummary);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  private loadSummaryCollateralSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const applicationNumber = this.creditProposal.id;
      this.collateralService.getSummaryCollateral(applicationNumber, { page: 0, size: 9999 }).subscribe(
        res => {
          this.dataCollateral = lodash.filter(res.body, function (o) {
            return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
          });
          if (res.body.length > 0) {
            this.getBindingCalculateSummary(this.dataCollateral).then(() => {
              resolve();
            });
          } else {
            resolve();
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public getBindingCalculateSummary(res: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const array1 = res;
      const array2 = this.creditProposal.attributes['binding'];
      let getBindingCalculateValue;
      const data = [];
      array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
        data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
        getBindingCalculateValue = data.filter(item => item !== undefined);
        this.fungsiSumcredit('both')
          .then(() => {
            const biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
            const biddingValueCoverage = this.convertNan(Number(biddingValueSum) / Number(this.totalPlafond));
            this.creditProposal.attributes['collateralSummary'].biddingValueCoverage = biddingValueCoverage.toFixed(2);
            resolve(); // Resolve the promise when the operation completes
          })
          .catch((error: any) => {
            reject(error); // Reject the promise if there is an error
          });
      });
    });
  }

  private convertDate(date: any): any {
    if (typeof date === 'string') {
      let tempDate = '';
      const pointerDate = date.substring(11, 1);

      if (pointerDate === 'T') {
        tempDate = date.split('T')[0];
      }

      const newD = new Date(tempDate);
      const utcDate = new Date(Date.UTC(newD.getFullYear(), newD.getMonth(), newD.getDate(), newD.getHours(), newD.getMinutes()));
      return utcDate;
    } else {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
      return utcDate;
    }
  }
  public save(): Promise<void> {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);
    return new Promise((resolve, reject) => {
      this.creditProposalService.update(this.preSave('not-complate')).subscribe(
        res => {
          this.creditProposal.collateralProductRelations = res.body.collateralProductRelations;
          this.creditProposal.collaterals = res.body.collaterals;
          resolve(); // Panggil resolve() saat proses selesai
        },
        error => {
          reject(error); // Panggil reject() jika terjadi kesalahan
        }
      );
    });
  }
  private preSave(status: string): ICreditProposal {
    for (let i = 0; i < this.creditProposalService.partySliks.length; i++) {
      this.creditProposal.sliks = [...this.creditProposal.sliks, this.creditProposalService.partySliks[i]];
    }
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);

    if (this.router.url.split('/')[1] === 'credit-proposal-status') {
      if (copyCreditProposal.attributes.businessActivity.visitDate) {
        if (typeof copyCreditProposal.attributes.businessActivity.visitDate === 'object') {
          copyCreditProposal.attributes.businessActivity.visitDate = this.convertDate(
            copyCreditProposal.attributes.businessActivity.visitDate
          );
        }
      }
    }

    copyCreditProposal.attributes['collateralSummary'] = JSON.stringify(copyCreditProposal.attributes['collateralSummary']);
    copyCreditProposal.attributes['businessGroup'] = JSON.stringify(copyCreditProposal.attributes['businessGroup']);
    copyCreditProposal.attributes['shareHolder'] = JSON.stringify(copyCreditProposal.attributes['shareHolder']);
    copyCreditProposal.attributes['correspondence'] = JSON.stringify(copyCreditProposal.attributes['correspondence']);
    copyCreditProposal.attributes['basicInformation'] = JSON.stringify(copyCreditProposal.attributes['basicInformation']);
    copyCreditProposal.attributes['guaranturAnalysis'] = JSON.stringify(copyCreditProposal.attributes['guaranturAnalysis']);
    copyCreditProposal.attributes['riksCriteria'] = JSON.stringify(copyCreditProposal.attributes['riksCriteria']);
    copyCreditProposal.attributes['convenant'] = JSON.stringify(copyCreditProposal.attributes['convenant']);
    copyCreditProposal.attributes['creditProposalParent'] = JSON.stringify(copyCreditProposal.attributes['creditProposalParent']);
    copyCreditProposal.attributes['businessActivity'] = JSON.stringify(copyCreditProposal.attributes['businessActivity']);
    copyCreditProposal.attributes['analysisOfCalculation'] = JSON.stringify(copyCreditProposal.attributes['analysisOfCalculation']);
    copyCreditProposal.attributes['bankAnalyst'] = JSON.stringify(copyCreditProposal.attributes['bankAnalyst']);
    copyCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(copyCreditProposal.attributes['proformaLaporanKeuangan']);
    copyCreditProposal.attributes['tabSummary'] = JSON.stringify(copyCreditProposal.attributes['tabSummary']);
    copyCreditProposal.attributes['insurance'] = JSON.stringify(copyCreditProposal.attributes['insurance']);
    copyCreditProposal.attributes['binding'] = JSON.stringify(copyCreditProposal.attributes['binding']);
    copyCreditProposal.debtorData.attributes['prospectPerson'] = JSON.stringify(copyCreditProposal.debtorData.attributes['prospectPerson']);
    copyCreditProposal.attributes['repaymentCapability'] = JSON.stringify(copyCreditProposal.attributes['repaymentCapability']);
    copyCreditProposal.attributes['facilityDetail'] = JSON.stringify(this.creditProposal.attributes['facilityDetail']);
    copyCreditProposal.attributes['opinionHistory'] = JSON.stringify(this.creditProposal.attributes['opinionHistory']);
    copyCreditProposal.attributes['tabCustomer'] = JSON.stringify(this.creditProposal.attributes['tabCustomer']);
    copyCreditProposal.attributes['tradeCheckingSupplier'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingSupplier']);
    copyCreditProposal.attributes['tradeCheckingBuyers'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingBuyers']);
    copyCreditProposal.attributes['tradeCheckingRemarks'] = JSON.stringify(copyCreditProposal.attributes['tradeCheckingRemarks']);
    copyCreditProposal.attributes['collateralChecklist'] = JSON.stringify(this.creditProposal.attributes['collateralChecklist']);
    copyCreditProposal.attributes['tabSummaryMessage'] = JSON.stringify(this.creditProposal.attributes['tabSummaryMessage']);
    copyCreditProposal.attributes['managementInfo'] = JSON.stringify(this.creditProposal.attributes['managementInfo']);
    copyCreditProposal.attributes['purposePricing'] = JSON.stringify(copyCreditProposal.attributes['purposePricing']);
    copyCreditProposal.attributes['cpRacBelow'] = JSON.stringify(copyCreditProposal.attributes['cpRacBelow']);
    copyCreditProposal.attributes['cpRacBack'] = JSON.stringify(copyCreditProposal.attributes['cpRacBack']);
    copyCreditProposal.attributes['emptyField'] = JSON.stringify(copyCreditProposal.attributes['emptyField']);
    copyCreditProposal.attributes['collateralPrevious'] = JSON.stringify(copyCreditProposal.attributes['collateralPrevious']);
    copyCreditProposal.attributes['facilityTakeOver'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOver']);
    copyCreditProposal.attributes['facilityTakeOverAfterBank'] = JSON.stringify(copyCreditProposal.attributes['facilityTakeOverAfterBank']);
    copyCreditProposal.attributes['complienceReccomendation'] = JSON.stringify(copyCreditProposal.attributes['complienceReccomendation']);
    copyCreditProposal.attributes['industryLimit'] = JSON.stringify(copyCreditProposal.attributes['industryLimit']);
    copyCreditProposal.attributes['offeringLetter'] = JSON.stringify(copyCreditProposal.attributes['offeringLetter']);
    copyCreditProposal.attributes['bankAnalystMessage'] = JSON.stringify(copyCreditProposal.attributes['bankAnalystMessage']);
    copyCreditProposal.attributes['previous'] = JSON.stringify(copyCreditProposal.attributes['previous']);
    copyCreditProposal.attributes['offeringLetterPreparation'] = JSON.stringify(copyCreditProposal.attributes['offeringLetterPreparation']);
    copyCreditProposal.attributes['creditProposalCollateralData'] = JSON.stringify(
      copyCreditProposal.attributes['creditProposalCollateralData']
    );
    copyCreditProposal.attributes['retriveData'] = JSON.stringify(copyCreditProposal.attributes['retriveData']);
    copyCreditProposal.attributes['remarksFinancialStatement'] = JSON.stringify(
      this.creditProposal.attributes['remarksFinancialStatement']
    );
    copyCreditProposal.attributes['rejectReason'] = JSON.stringify(copyCreditProposal.attributes['rejectReason']);
    copyCreditProposal.attributes['legalLendingLimit'] = JSON.stringify(copyCreditProposal.attributes['legalLendingLimit']);
    copyCreditProposal.attributes['calculationExposure'] = JSON.stringify(copyCreditProposal.attributes['calculationExposure']);
    copyCreditProposal.groupProducts = [];
    copyCreditProposal.attributes['approvalStatus'] = JSON.stringify(copyCreditProposal.attributes['approvalStatus']);
    copyCreditProposal.attributes['dataAssignTo'] = JSON.stringify(copyCreditProposal.attributes['dataAssignTo']);
    copyCreditProposal.attributes['dataAssignToCRO'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCRO']);
    copyCreditProposal.attributes['dataAssignToCCAdmin'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToCCAdmin']);
    copyCreditProposal.attributes['dataAssignToLegalOfficer'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToLegalOfficer']);
    copyCreditProposal.attributes['coverageTotal'] = JSON.stringify(copyCreditProposal.attributes['coverageTotal']);
    copyCreditProposal.attributes['lendingProgramParameter'] = JSON.stringify(copyCreditProposal.attributes['lendingProgramParameter']);
    copyCreditProposal.attributes['collateralGroup'] = JSON.stringify(copyCreditProposal.attributes['collateralGroup']);
    copyCreditProposal.attributes['dataAssignToDPPKReview1'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToDPPKReview1']);
    copyCreditProposal.attributes['dataAssignToDPPKReview2'] = JSON.stringify(copyCreditProposal.attributes['dataAssignToDPPKReview2']);
    if (copyCreditProposal.prospectPerson) {
      copyCreditProposal.prospectPerson.dob = this.creditProposalStartState.prospectPerson.dob;
    }

    return copyCreditProposal;
  }

  public countTotalMVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    this.creditProposal.attributes['collateralSummary'].countTotalMV = result;
    return result;
  }

  public countTotalLVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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

    this._creditProposal.attributes['collateralSummary'].countTotalLV = result;
    return result;
  }

  public countTotalMVKJJPSummary() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    this.creditProposal.attributes['collateralSummary'].countTotalMV = result;
    return result;
  }

  public countTotalLVKJJPSummary() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
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
    this._creditProposal.attributes['collateralSummary'].countTotalLVKJJP = result;
    return result;
  }
}

import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
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
import { CollateralPropertyResultListComponent } from 'app/entities/collateral-property/collateral-property-result-list.component';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { ApplicationProduct } from 'app/entities/application-product/application-product.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { CreditProposalCollateralSummaryDialogComponent } from './credit-proposal-collateral-summary-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class SummaryGridComponent
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

  public _collateralProperty: ICollateralProperty[];
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
  public totalPlafond: number;
  public biddingValueSum: number;
  public biddingValueCoverage: any;

  public selectedMenu: string;
  public isChecked: boolean;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }, { text: 'SUMMARY' }];
  public bindingTypesHobies = [];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }
  private _group: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  @Input()
  get group() {
    return this._group;
  }
  set group(data: string) {
    this._group = data;
  }
  public _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
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
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }

  public presentage(value: string, status: string) {
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      if (status === 'mv') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
        }
      } else if (status === 'lv') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
        }
      } else if (status === 'mvKjjp') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
        }
      } else if (status === 'lvKjjp') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
        }
      }
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      if (status === 'mv') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
        }
      } else if (status === 'lv') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
        }
      } else if (status === 'mvKjjp') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
        }
      } else if (status === 'lvKjjp') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
        }
      }
      return '0.00' + 'x';
    } else {
      if (status === 'mv') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.mvInternalCoverage = num;
        }
      } else if (status === 'lv') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.lvInternalCoverage = num;
        }
      } else if (status === 'mvKjjp') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = num;
        }
      } else if (status === 'lvKjjp') {
        if (this.subroute !== 'compare-data') {
          this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = num;
        }
      }
      return num + 'x';
    }
  }

  private totalCoverage() {
    const mvCoverage =
      this._creditProposal.attributes['collateralSummary'].countTotalMV / this._creditProposal.attributes['collateralSummary'].creditLimit;
    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].mvInternalCoverage = mvCoverage.toFixed(2);
    }
    const lvCoverage =
      this._creditProposal.attributes['collateralSummary'].countTotalLV / this._creditProposal.attributes['collateralSummary'].creditLimit;
    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].lvInternalCoverage = lvCoverage.toFixed(2);
    }
    const mvKjjpCoverage = this._creditProposal.attributes['collateralSummary'].countTotalMVKJJP / 0;
    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].mvKjjpCoverage = mvKjjpCoverage.toFixed(2);
    }
    const lvKjjpCoverage =
      this._creditProposal.attributes['collateralSummary'].countTotalLVKJJP /
      this._creditProposal.attributes['collateralSummary'].creditLimit;
    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].lvKjjpCoverage = lvKjjpCoverage.toFixed(2);
    }
  }

  @Input() isViewMode;
  public insuranceTypes = [];
  constructor(
    protected _snackbar: MatSnackBar,
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private partyCifService: PartyCifService,
    private generalParameterService: GeneralParameterService,
    private activatedRoute: ActivatedRoute,
    private cashCollateralService: CashCollateralService
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.totalMVInt = 0;
    this.totalLVInt = 0;

    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.subroute = params['subroute'];
    });
  }

  subroute: string;

  ngOnInit(): void {
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === '') {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }

    // this.isViewMode && this.displayedColumns.pop();

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
    this.setCertyficateType();
    this.totalCoverage();
    this.getLovInsuranceType();
    this.lovBindingType();
  }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  private loadSummaryCollateral(): void {
    const applicationNumber = this.creditProposal.id;
    this.collateralService.getSummaryCollateral(applicationNumber, { page: 0, size: 9999 }).subscribe(res => {
      this.dataCollateral = lodash.filter(res.body, function (o) {
        return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
      });
      for (let i = 0; i < this.dataCollateral.length; i++) {
        this.findCollateralProperty(this.dataCollateral[i].partyId);
      }
      this.dataItem = new MatTableDataSource(this.dataCollateral);
      this.dataItem.paginator = this.paginator;
      this.getBindingCalculate(this.dataCollateral);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.id) {
        this.loadSummaryCollateral();
      }
    }
    // if (changes['collateralProperties']) {
    //   this.collateralProperties = changes['collateralProperties'].currentValue;
    // }
  }
  public collateral: any;
  ngAfterViewInit(): void {
    let a = [];
    for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
      a = lodash.concat(a, this.creditProposal.collaterals[i]);
    }
    this.collateral = new MatTableDataSource(a);
    this.collateral.paginator = this.paginator2;
  }

  public openDialog(element: ICollateral): void {
    this.collateralStartState = lodash.cloneDeep(element);
    this.creditProposalStartState = lodash.cloneDeep(this.creditProposal);
    let cp = {};
    for (let index = 0; index < this.dataItem.length; index++) {
      if (this.dataItem[index].collateralId === element.collateralId) {
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
        isViewMode: true,
        group: this.group,
      },
    };
    const dialogRef = this.dialog.open(CreditProposalCollateralSummaryDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const collateralIdx: number = lodash.findIndex(this.creditProposal.collaterals, function (o) {
          return o.id === res['collateral'].id;
        });
        if (collateralIdx > -1) {
          this.dataItem[collateralIdx] = res['collateral'];
          const filter = this.dataItem.filter(obj => obj.statusId !== 'CANCEL' && obj.statusId !== 'RELEASE');
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
      } else {
        const collateralIdx: number = lodash.findIndex(this.creditProposal.collaterals, o => o.id === this.collateralStartState.id);
        if (collateralIdx > -1) {
          this.dataItem[collateralIdx] = this.collateralStartState;
          const filter = this.dataItem.filter(obj => obj.statusId !== 'CANCEL' && obj.statusId !== 'RELEASE');
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
  getLovInsuranceType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
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
    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].countTotalLV = result;
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

    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].countTotalMV = result;
    }
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
    return new Promise<void>((resolve, reject) => {
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
      if (this.subroute !== 'compare-data') {
        this._creditProposal.attributes['collateralSummary'].creditLimit = creditLimit;
      }

      this.totalPlafond = result + dolar;

      resolve();
    });
  }

  //
  public totalPlafondData(value: string): number {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    // const dataFilter =
    //   this.parsedAttribute?.previousReturn && this.isOnCompareData && !this.isCompareDar
    //     ? this.parsedAttribute?.previousReturn?.products?.filter(obj => obj.subLimit === false)
    //     : this.parsedAttribute.previousHistory?.products.filter(obj => obj.subLimit === false);

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter?.length > 0) {
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
    return result + dolar;
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
    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].countTotalMVKJJP = result;
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

    if (this.subroute !== 'compare-data') {
      this._creditProposal.attributes['collateralSummary'].countTotalLVKJJP = result;
    }

    return result;
  }

  // get Ownership
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

  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }

  public slideChange($event) {
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
      if (this.creditProposal.collaterals?.length > 0 && this.creditProposal.products?.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          for (let j = 0; j < this.creditProposal.products.length; j++) {
            if ($event === true) {
              const tempCollateralProductRelationObject = {
                collateralId: this.creditProposal.collaterals[i].id,
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
            this.creditProposal.collateralProductRelations[i].collateralId === this.creditProposal.collaterals[i]?.id &&
            this.creditProposal.collateralProductRelations[i].applicationProduct?.id === this.creditProposal.products[i]?.id
          ) {
            this.creditProposal.collateralProductRelations.splice(i);
          }
        }
      }
    }
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

  public getBindingCalculate(res: any[]) {
    const array1 = res;
    const array2 =
      typeof this.creditProposal.attributes['binding'] === 'string'
        ? JSON.parse(this.creditProposal.attributes['binding'])
        : this.creditProposal.attributes['binding'];
    let getBindingCalculateValue;
    const data = [];
    array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
      data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
      getBindingCalculateValue = data.filter(item => item !== undefined);
      this.fungsiSumcredit('both').then(() => {
        this.biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
        const value: number = this.convertNan(Number(this.biddingValueSum) / Number(this.totalPlafond));
        this.biddingValueCoverage = value.toFixed(2);
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
}

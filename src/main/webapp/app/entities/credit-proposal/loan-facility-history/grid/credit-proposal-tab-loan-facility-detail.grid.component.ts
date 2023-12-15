import { Component, ViewChild, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../../credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalLoanFacilityDialogHistoryComponent } from '../dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'jhi-loan-facility-detail-grid-history',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class LoanFacilityDetailGridHistoryComponent implements OnInit, AfterViewInit {
  @Input() isOnMemo: Boolean = false;
  @Output() newItemEvent = new EventEmitter<any[]>();
  public dataParty: MatTableDataSource<any>;
  @Input() isViewMode: Boolean = false;
  @Input() isOnCompareData: Boolean = false;
  public _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public view: boolean;
  public interestTypeList = [];
  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;

  public displayColumns: string[] = [
    'no',
    'approvalNo',
    'facilityCategory',
    'applicationType',
    'facilityType',
    'subLimit',
    'currency',
    'initialLimit',
    'outstanding',
    'changes',
    'totalCreditLimit',
    'interestrate',
    'proposeRate',
    'provisionAmount',
    'tenor',
    'maturityDate',
    'firstDisbursementDate',
    'action',
  ];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;
  public parsedAttribute = {};

  constructor(
    public partyCifService: PartyCifService,
    public dialog: MatDialog,
    public _router: Router,
    protected generalParameterService: GeneralParameterService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  ngOnInit(): void {
    this.parsedAttribute = parsePreviousAtrribute(this.creditProposal);
    this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    // this.isViewMode && this.displayColumns.pop();
  }

  // ngOnChanges(changes: SimpleChanges) {

  //   if (changes['creditProposal']) {
  //     // this.dataParty = new MatTableDataSource<any>;
  //     // this.dataParty.paginator = this.paginator;
  //     this.partyCifFunc()
  //   }
  // }
  partyCifFunc() {
    const dataFilter = [];
    const previous =
      this.parsedAttribute['previousReturn'] && this.isOnCompareData
        ? this.parsedAttribute['previousReturn']
        : this.parsedAttribute['previousHistory'];
    if (previous.products) {
      for (let i = 0; i < previous.products.length; i++) {
        dataFilter.push(previous.products[i]);
      }
      // this.dataParty = new MatTableDataSource<any>(dataFilter);

      this.dataParty = new MatTableDataSource(previous.products);
      console.log('party', this.dataParty);
      this.dataParty.paginator = this.paginator;
    }
  }
  ngAfterViewInit() {
    this.dataParty.paginator = this.paginator;
  }
  public getCurrency(element: IApplicationProduct) {
    if (element.provisionFeeType === 'Amount IDR') {
      return 'IDR';
    }

    if (element.provisionFeeType === 'Amount USD') {
      return 'USD';
    }
    return '';
  }

  public getCurrency2(element: IApplicationProduct) {
    if (element.provisionFeeType === '%p.a') {
      return '%p.a';
    }
    return '';
  }

  public openDialog(param: IApplicationProduct = null): void {
    if (param) {
      this.applicationProduct = param;
      if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
        this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
      }
      if (this.applicationProduct.attributes.commitedLine === 'true') {
        this.applicationProduct.attributes.commitedLine = true;
      } else if (this.applicationProduct.attributes.commitedLine === 'false') {
        this.applicationProduct.attributes.commitedLine = false;
      }
      if (this.applicationProduct.attributes.subLimit === 'true') {
        this.applicationProduct.attributes.subLimit = true;
      } else if (this.applicationProduct.attributes.subLimit === 'false') {
        this.applicationProduct.attributes.subLimit = false;
      }
      if (this.applicationProduct.attributes.restructuredStatus === 'true') {
        this.applicationProduct.attributes.restructuredStatus = true;
      } else if (this.applicationProduct.attributes.restructuredStatus === 'false') {
        this.applicationProduct.attributes.restructuredStatus = false;
      }
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      attr.nomorUrutFasilitas = this.creditProposal.products.length + 1;
      this.applicationProduct.attributes = attr;
    }

    const dialogRef = this.dialog.open(CreditProposalLoanFacilityDialogHistoryComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
      },
    });
  }
  // dialogRef.afterClosed().subscribe(res => {
  //   if (res) {
  //     this.applicationProduct = res.applicationProduct;
  //     this.creditProposal.collateralProductRelations = [...res.creditProposal.collateralProductRelations];
  //     this.onSave();
  //   }
  // });

  // public onSave(): void {
  //   const appProduct: IApplicationProduct = this.applicationProduct;
  //   let idx: number;
  //   if (!this.applicationProduct.id) {
  //     idx = lodash.findIndex(this.creditProposal.products, function (o) {
  //       return o.uniqueKey === appProduct.uniqueKey;
  //     });

  //     if (idx === -1) {
  //       const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
  //       copyApplicationProduct.applicationId = this.creditProposal.id;
  //       this.dataParty = [...this.dataParty, this.applicationProduct];
  //       this.creditProposal.products = [...this.creditProposal.products, this.applicationProduct];
  //     } else {
  //       this.creditProposal.products[idx] = appProduct;
  //       this.dataParty[idx] = appProduct;
  //     }
  //   } else {
  //     idx = lodash.findIndex(this.creditProposal.products, function (o) {
  //       return o.id === appProduct.id;
  //     });
  //     this.creditProposal.products[idx] = appProduct;
  //     this.dataParty[idx] = appProduct;
  //   }
  // }

  // Delete Confirmation
  // public onDelete(element): void {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '25vw',
  //     data: {
  //       title: 'Delete Facility Detail Data',
  //       message: 'Are you sure to delete this data?',
  //     },
  //     panelClass: 'custom-dialog-container-delete',
  //   });
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       const dataGrid = this.creditProposal.products.filter(({ attributes }) => attributes !== element.attributes);
  //       this.dataParty = dataGrid;
  //       this.creditProposal.products = dataGrid;
  //       this.partyCifFunc();
  //     }
  //   });
  // }

  // public onDelete(element: IApplicationProduct) {
  //   const dataGrid = this.creditProposal.products.filter(({ attributes }) => attributes !== element.attributes);
  //   this.dataParty = dataGrid;
  //   this.creditProposal.products = dataGrid;
  //   this.partyCifFunc();
  // }

  public parseStringToInt(data: string): number {
    return parseInt(data, 10);
  }

  public printElement(element) {
    let subLimit: string;
    subLimit = '';
    if (element === true || element === 'true') {
      subLimit = 'Yes';
    } else if (element === false || element === 'false') {
      subLimit = 'No';
    }
    return subLimit;
  }

  print() {
    console.log(this._creditProposal);
  }

  getRequeredSpread(element) {
    if (element === null || element === undefined) {
      return 0;
    } else {
      return element.replace('%', '');
    }
  }

  getRateTypeDesc(element) {
    if (element) {
      const typeDesc = this.interestTypeList.find(obj => obj.code === element);
      if (typeDesc) {
        return typeDesc.value;
      }
    }
    return '';
  }

  public lovInterestRateTypeList() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INTEREST_RATE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.interestTypeList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        console.log('interest type', this.interestTypeList);
      });
  }

  public getFacilityType(element: IApplicationProduct, i) {
    if (element.productTypeId !== undefined && element.productTypeId !== null) {
      if (element.applicationType === 'Existing') {
        if (!element.attributes.facilityType) {
          element.attributes.facilityType = element.productTypeId;
        }
      }
      return element.productTypeId;
    } else if (element.attributes.facilityType) {
      element.productTypeId = element.attributes.facilityType;
      return element.attributes.facilityType;
    }
  }
  public printElements(element) {
    if (element === null || element === 'null') {
      return 0;
    }
    return element;
  }

  public getCurrencyType(element) {
    if (element !== null) {
      return element;
    }
    return '';
  }

  public hiddenButton(element: IApplicationProduct) {
    if (element.hobis === true) {
      return true;
    } else if (this.view) {
      return true;
    } else {
      return false;
    }
  }
  public getPricingRate(value) {
    if (value) {
      return value + '%';
    } else {
      return '0%';
    }
  }
}

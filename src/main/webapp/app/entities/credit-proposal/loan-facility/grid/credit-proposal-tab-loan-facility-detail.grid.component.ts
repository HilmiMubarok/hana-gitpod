import { Component, Input, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
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
import { CreditProposalLoanFacilityDialogComponent } from '../dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IProduct } from 'app/entities/product/product.model';
import { PageEvent } from '@angular/material/paginator';
import { CreditProposalService } from '../../credit-proposal.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { GeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import moment from 'moment';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent implements OnInit, OnChanges {
  public dataParty = [];

  @Input() isOnMemo: Boolean = false;
  @Input() isViewMode: Boolean = false;
  public _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public interestTypeList = [];
  public dataProduct: IApplicationProduct[];
  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;

  length: number;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

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
  public view: boolean;
  public kurs: any;

  private applicationProductStartState: IApplicationProduct;

  constructor(
    public partyCifService: PartyCifService,
    public dialog: MatDialog,
    public _router: Router,
    private creditProposalService: CreditProposalService,
    private changeDetectorRefs: ChangeDetectorRef,
    protected generalParameterService: GeneralParameterService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      console.log('new cp', this.creditProposal);
      this.dataProduct = this.creditProposal.products;
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void {
    this.currency();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    this.lovInterestRateTypeList();
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

  public currency() {
    if (this.applicationProduct.currencyId !== 'IDR') {
      const setDate = new Date().toISOString().split('T')[0];
      this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
        this.kurs = res.body[0]?.factor;
      });
    }
  }

  public openDialog(param: IApplicationProduct = null): void {
    if (param) {
      this.applicationProduct = param;
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      const nomorUrutFasilitasUnsorted = [];
      if (this.creditProposal.products) {
        if (this.creditProposal.products.length > 0) {
          for (let i = 0; i < this.creditProposal.products.length; i++) {
            nomorUrutFasilitasUnsorted.push(this.creditProposal.products[i].nomorUrutFasilitas);
          }
          const nomorUrutFasilitasSorted = nomorUrutFasilitasUnsorted.sort((a, b) => (a > b ? 1 : -1));
          if (nomorUrutFasilitasSorted) {
            if (nomorUrutFasilitasSorted.length > 0) {
              this.applicationProduct.nomorUrutFasilitas = Number(nomorUrutFasilitasSorted[nomorUrutFasilitasSorted.length - 1]) + 1;
            }
          }
        } else if (this.creditProposal.products.length === 0) {
          this.applicationProduct.nomorUrutFasilitas = 1;
        }
      }
      this.applicationProduct.attributes = attr;
    }

    this.applicationProductStartState = lodash.cloneDeep(this.applicationProduct);

    const dialogRef = this.dialog.open(CreditProposalLoanFacilityDialogComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.applicationProduct = res.applicationProduct;
		this.applicationProduct.maturityDate = this.setDate(res);
        this.creditProposal.collateralProductRelations = [...res.creditProposal.collateralProductRelations];
        this.onSave(true);
      } else {
        this.onSave(false);
      }
    });
  }

  public onSave(mark: boolean): void {
    const appProduct: IApplicationProduct = this.applicationProduct;
    let idx = -1;
    if (!this.applicationProduct.id) {
      if (this.creditProposal.products) {
        if (this.creditProposal.products.length) {
          for (let i = 0; i < this.creditProposal.products.length; i++) {
            if (appProduct) {
              if (this.creditProposal.products[i].nomorUrutFasilitas === appProduct.nomorUrutFasilitas) {
                idx = i;
              }
            }
          }
        }
      }

      if (idx === -1) {
        if (mark) {
          let isAlready2StepVerification = false;
          this.dataProduct.forEach(dP => {
            if (dP.nomorUrutFasilitas === appProduct.nomorUrutFasilitas) {
              isAlready2StepVerification = true;
            }
          });

          if (isAlready2StepVerification) {
            idx = lodash.findIndex(this.dataProduct, function (o) {
              return o.nomorUrutFasilitas === appProduct.nomorUrutFasilitas;
            });
            this.creditProposal.products[idx] = mark ? appProduct : this.applicationProductStartState;
            this.dataProduct[idx] = mark ? appProduct : this.applicationProductStartState;
            this.dataProduct = [...this.dataProduct];
          } else {
            const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
            copyApplicationProduct.applicationId = this.creditProposal.id;

            this.dataProduct = [...this.dataProduct, copyApplicationProduct];
            this.creditProposal.products = [...this.creditProposal.products, copyApplicationProduct];

            // this.dataParty = [...this.dataParty, this.applicationProduct];
            // this.creditProposal.products = [...this.creditProposal.products, this.applicationProduct];
          }
        }
      }

      // else {
      //   this.creditProposal.products[idx] = mark ? appProduct : this.applicationProductStartState;
      //   this.dataParty[idx] = mark ? appProduct : this.applicationProductStartState;
      //   this.dataParty = [...this.dataParty];
      // }
    } else {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.id === appProduct.id;
      });
      this.creditProposal.products[idx] = mark ? appProduct : this.applicationProductStartState;
      this.dataProduct[idx] = mark ? appProduct : this.applicationProductStartState;
      this.dataProduct = [...this.dataProduct];
    }
  }

  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Facility Detail Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGrid = this.creditProposal.products.filter(obj => obj.nomorUrutFasilitas !== element.nomorUrutFasilitas);
        this.dataProduct = dataGrid;
        this.creditProposal.products = this.dataProduct;
      }
    });
  }

  public parseStringToInt(data: string): number {
    return parseInt(data, 10);
  }

  public printElement(element) {
    let sublimit: string;
    sublimit = '';
    if (element === true || element === 'true') {
      sublimit = 'Yes';
    } else if (element === false || element === 'false') {
      sublimit = 'No';
    }
    return sublimit;
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

  private setDate(data: any) {
    const getDate = data.applicationProduct.maturityDate;
    const staticDate = moment(new Date(getDate)).format().substring(0, 19) + 'Z';
    return staticDate;
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
}

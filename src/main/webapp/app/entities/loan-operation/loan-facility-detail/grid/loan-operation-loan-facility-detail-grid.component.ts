import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProduct,
  IApplicationProductAttribute,
} from 'app/entities/application-product/application-product.model';
import { ICollateralProductRelation } from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CreditProposalLoanFacilityDialogComponent } from 'app/entities/credit-proposal/loan-facility/dialog/loan-facility-dialog.component';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { LoanOperationLoanFacilityDetailDialogComponent } from '../dialog/loan-operation-loan-facility-dialog.component';

@Component({
  selector: 'jhi-loan-operation-loan-facility-detail-grid',
  templateUrl: './loan-operation-loan-facility-detail-grid.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/grid/loan.scss'],
})
export class LoanOperationLoanFacilityDetailGridComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    public partyCifService: PartyCifService,
    public dialog: MatDialog,
    public _router: Router,
    private creditProposalService: CreditProposalService,
    protected generalParameterService: GeneralParameterService,
    private messageService: MessageService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

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
  public dataParty = [];
  public _creditProposal: ICreditProposal;
  public interestTypeList = [];
  public dataProduct: IApplicationProduct[];
  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;
  public length: number;
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [5, 10, 25];
  public hidePageSize = false;
  public showPageSizeOptions = true;
  public showFirstLastButtons = true;
  public disabled = false;
  public pageEvent: PageEvent;
  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;
  public view: boolean;
  public kurs: any;

  private applicationProductStartState: IApplicationProduct;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() isOnMemo: Boolean = false;
  @Input() isViewMode: Boolean = false;
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.currency();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    this.lovInterestRateTypeList();

    this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
    this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
    this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['creditProposal']) {
      this.dataProduct = this.creditProposal.products;
    }
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }
    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  public getdataNull(element) {
    if (element !== null) {
      return element;
    }
    return '';
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
      this.creditProposalService
        .getCurrency('USD', 'IDR', setDate.replace(/-/g, ''))
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
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

    const dialogRef = this.dialog.open(LoanOperationLoanFacilityDetailDialogComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
        isElement: this.isElement,
        isLabel: this.isLabel,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.applicationProduct.maturityDate) {
          this.applicationProduct.maturityDate = this.setDate(res);
        }
        if (res.applicationProduct.attributes['thruDateContractTemp']) {
          this.applicationProduct.thruDateContract = this.setDateTenor(res.applicationProduct.attributes['thruDateContractTemp']);
        }
        if (res.applicationProduct.startDateContract) {
          this.applicationProduct.startDateContract = this.setDateTenor(res.applicationProduct.startDateContract);
        }

        this.applicationProduct = res.applicationProduct;
        this.creditProposal.collateralProductRelations = [...res.creditProposal.collateralProductRelations];
        this.onSave(true, param);
      } else {
        this.onSave(false);
      }
    });
  }

  public onSave(mark: boolean, param?): void {
    const appProduct: IApplicationProduct = this.applicationProduct;
    const idx: number = lodash.findIndex(this.dataProduct, function (o) {
      return o.nomorUrutFasilitas === appProduct.nomorUrutFasilitas;
    });
    if (mark) {
      if (param) {
        this.dataProduct[idx] = appProduct;
        this.dataProduct = lodash.flatten(this.dataProduct);
        this.creditProposal.products = this.dataProduct;

        this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
        this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
        this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();
      } else {
        const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
        copyApplicationProduct.applicationId = this.creditProposal.id;

        this.dataProduct = [...this.dataProduct, copyApplicationProduct];
        this.creditProposal.products = [...this.creditProposal.products, copyApplicationProduct];

        this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
        this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
        this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();
      }
    } else {
      this.dataProduct[idx] = this.applicationProductStartState;
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

        this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
        this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
        this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.interestTypeList = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
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

  private setDateTenor(data: any) {
    return moment(new Date(data)).format().substring(0, 19) + 'Z';
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

  public countTotalPsrDebitur() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].totalPlafond !== undefined) {
            if (filterIdr[i].hobis) {
              if (filterIdr[i].facilityType === 'FX') {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            } else {
              if (filterIdr[i].attributes.facilityType === 'FX') {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].totalPlafond !== undefined) {
            if (filterUsd[i].hobis) {
              if (filterUsd[i].facilityType === 'FX') {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            } else {
              if (filterUsd[i].attributes.facilityType === 'FX') {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
          }
        }
      }
    }
    return result + dolar;
  }

  public countShortTermLoanDebitur() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].totalPlafond !== undefined) {
            if (filterIdr[i].periodType === 'Week') {
              if (filterIdr[i].tenor <= 52) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
            if (filterIdr[i].periodType === 'Month') {
              if (filterIdr[i].tenor <= 12) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
            if (filterIdr[i].periodType === 'Year') {
              if (filterIdr[i].tenor <= 1) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].totalPlafond !== undefined) {
            if (filterUsd[i].periodType === 'Week') {
              if (filterUsd[i].tenor <= 52) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
            if (filterUsd[i].periodType === 'Month') {
              if (filterUsd[i].tenor <= 12) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
            if (filterUsd[i].periodType === 'Year') {
              if (filterUsd[i].tenor <= 1) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
          }
        }
      }
    }
    return result + dolar;
  }

  public countLongThermLoanDebitur() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].totalPlafond !== undefined) {
            if (filterIdr[i].periodType === 'Week') {
              if (filterIdr[i].tenor > 52) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
            if (filterIdr[i].periodType === 'Month') {
              if (filterIdr[i].tenor > 12) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
            if (filterIdr[i].periodType === 'Year') {
              if (filterIdr[i].tenor > 1) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].totalPlafond !== undefined) {
            if (filterUsd[i].periodType === 'Week') {
              if (filterUsd[i].tenor > 52) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
            if (filterUsd[i].periodType === 'Month') {
              if (filterUsd[i].tenor > 12) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
            if (filterUsd[i].periodType === 'Year') {
              if (filterUsd[i].tenor > 1) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
          }
        }
      }
    }
    return result + dolar;
  }

  public getPricingRate(value) {
    if (value) {
      return value + '%';
    } else {
      return '0%';
    }
  }

  public cekFacilityRelation(element) {
    let statDelete = true;
    if (this.creditProposal.collateralProductRelations.length > 0) {
      for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
        const data: ICollateralProductRelation[] = this.creditProposal.collateralProductRelations.filter(
          obj => obj.applicationProduct.nomorUrutFasilitas === element.nomorUrutFasilitas
        );
        if (data.length > 0) {
          statDelete = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'please check collateral info - tab cross collateral mapping to facility',
          });
          break;
        }
      }
      if (statDelete) {
        this.onDelete(element);
      }
    } else {
      if (statDelete) {
        this.onDelete(element);
      }
    }
  }
}

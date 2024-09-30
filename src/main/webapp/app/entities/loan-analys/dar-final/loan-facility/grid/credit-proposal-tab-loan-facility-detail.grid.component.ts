import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICollateralProductRelation } from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { PageEvent } from '@angular/material/paginator';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import {
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProduct,
  IApplicationProductAttribute,
} from 'app/entities/application-product/application-product.model';
import { LoanFacilityDialogTempComponent } from '../dialog/loan-facility-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import moment from 'moment';
import { MessageService } from 'primeng/api';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Subject, takeUntil } from 'rxjs';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-loan-facility-detail-grid-temp',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class LoanFacilityDetailGridTempComponent implements OnInit, OnChanges, OnDestroy {
  public dataParty = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  @Input() isViewMode: Boolean = false;
  public _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }

  public biddingValueCoverage: number;
  private _collateralProperty: ICollateralProperty[];
  public dataProduct: IApplicationProduct[];
  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;
  public creditProposalStartState: ICreditProposal;
  public totalPlafond: number;
  public dataCollateralSummary: any[];
  public biddingValueSum: number;

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
    private messageService: MessageService,
    private router: Router,
    private collateralService: CollateralService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.dataProduct = (() => {
        if (this.creditProposal.attributes.darRevHistory) {
          const parsedData = parsePreviousAtrribute(this.creditProposal);

          return parsedData['darRevHistory'].products;
        }
        return this.creditProposal.products;
      })();

      console.log('Data Product', { product: this.dataProduct, parsed: parsePreviousAtrribute(this.creditProposal) });
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
    // this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
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

  dataFunc(response: any) {
    this.partyCifService
      .find('cif/retrieve-cp-facility/' + response.body[0].customerNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        const cpFacility = JSON.parse(res.body.debtorData.attributes['cpFacility']);
        const dataParty = [];
        const aYear = [];
        for (let i = 0; i < cpFacility.length; i++) {
          const date2 = new Date(cpFacility[i].FILN10_TOT_EXP_IL);
          const date1 = new Date(cpFacility[i].FXFIG_TRX_DT);
          aYear.push(Math.round(Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24) / 360)));
          const data = {
            adminFee: '0',
            adminFeeRateAmountType: '',
            applicationType: 'Existing',
            availableLimit: cpFacility[i].AVAILABLE_LIMIT === undefined ? 0 : cpFacility[i].AVAILABLE_LIMIT,
            availablePeriod: '',
            availablePeriodType: '',
            changes: '0',
            commitedLine: 'false',
            currency: cpFacility[i].LNB_BASE_LON_CCY,
            currentInterestRate: cpFacility[i].FILN11_SPREAD_RT,
            // dateOS: '2022-11-24T10:57:14.435Z',
            dateOS: this.creditProposal.debtorData.lastSynchDate,
            disbursementCondition: '',
            facilityType: cpFacility[i].FACILITY_TYPE,
            gracePeriod: '0',
            gracePeriodType: cpFacility[i].FILN10_ROLL_GAP_GB,
            indexFacilityMain: '',
            indexRate: '0',
            initialLimit: cpFacility[i].FILN10_CONTRACT_AMT,
            installmentMethod: 'Maturity Repayment',
            instalmentEstimation: '0',
            interestRatePeriod: cpFacility[i].FILN10_ROLL_GAP,
            interestRatePeriodType: cpFacility[i].FILN10_ROLL_GAP_GB_NM,
            interestRateType: cpFacility[i].FIX_FLT_GB_NM,
            keterangan: '',
            kurs: this.kurs,
            loanPurpose: '',
            loanType: cpFacility[i].FILN11_COM_NM,
            maturity: '0',
            maturityDate: new Date(cpFacility[i].FILN10_TOT_EXP_IL).toISOString(),
            maturityPeriodType: (cpFacility[i].FILN10_ROLL_GAP_GB_NM = cpFacility[i].PERIOD_TYPE),
            memoDate: '2022-11-24T10:57:14.435Z',
            memoNo: '',
            nomorUrutFasilitas: i + 1,
            outstanding: cpFacility[i].LNB_BASE_LON_JAN,
            principalFrequency: '0',
            principalFrequencyPeriodType: '',
            provitionFee: '0',
            provitionFeeRateAmountType: '',
            remark: '',
            restructMethod: '',
            restructuredStatus: 'false',
            spreadOfMargin: '0',
            subLimit: 'false',
            subLimitFromExitingFacility: '',
            sublimitFromExistingFacility: '',
            totalPlafond: cpFacility[i].FILN10_CONTRACT_AMT,
            totalRate: '0',
            hobbies: true,
            loanAccount: cpFacility[i].LNB_BASE_AGR_REF_NO,
            firstDisbursementDate: new Date(cpFacility[i].FXFIG_TRX_DT).toISOString(),
          };

          dataParty.push(data);
        }
        const appProduct: IApplicationProduct = this.applicationProduct;
        let idx: number;
        if (!this.applicationProduct.id) {
          idx = lodash.findIndex(this.creditProposal.products, function (o) {
            return o.uniqueKey === appProduct.uniqueKey;
          });

          const countDataHobbies = [];
          for (let i = 0; i < this.dataParty.length; i++) {
            if (this.dataParty[i].attributes !== undefined) {
              if (this.dataParty[i].attributes['hobbies'] !== undefined) {
                if (this.dataParty[i].attributes['hobbies'] === 'true' || this.dataParty[i].attributes['hobbies'] === true) {
                  countDataHobbies.push(this.dataParty[i]);
                }
              }
            }
          }

          if (countDataHobbies.length < 1) {
            for (let i = 0; i < dataParty.length; i++) {
              const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
              copyApplicationProduct.applicationId = this.creditProposal.id;
              this.applicationProduct = {
                attributes: dataParty[i],
              };

              this.dataParty = [...this.dataParty, this.applicationProduct];
              this.length = this.dataParty.length;
            }

            this.creditProposal.attributes['loanHobbies'] = 'true';
            this.creditProposal.products = this.dataParty;
          } else {
            if (dataParty.length > 0) {
              this.creditProposal.attributes['loanHobbies'] = 'true';
            } else {
              this.creditProposal.attributes['loanHobbies'] = 'false';
            }
          }
        }
      });
  }

  public openDialog(param: IApplicationProduct = null): void {
    this.creditProposalStartState = lodash.cloneDeep(this.creditProposal);
    if (param) {
      this.applicationProduct = param;
      if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
        this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
      }
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      if (this.creditProposal.products) {
        if (this.creditProposal.products.length > 0) {
          for (let i = 0; i < this.creditProposal.products.length; i++) {
            const nomorUrutFasilitasUnsorted = [];
            nomorUrutFasilitasUnsorted.push(this.creditProposal.products[i].nomorUrutFasilitas);
            const nomorUrutFasilitasSorted = nomorUrutFasilitasUnsorted.sort((a, b) => (a > b ? 1 : -1));
            if (nomorUrutFasilitasSorted) {
              if (nomorUrutFasilitasSorted.length > 0) {
                this.applicationProduct.nomorUrutFasilitas = Number(nomorUrutFasilitasSorted[nomorUrutFasilitasSorted.length - 1]) + 1;
              }
            }
          }
        } else if (this.creditProposal.products.length === 0) {
          this.applicationProduct.nomorUrutFasilitas = 1;
        }
      }
      this.applicationProduct.attributes = attr;
    }

    this.applicationProductStartState = lodash.cloneDeep(this.applicationProduct);

    const dialogRef = this.dialog.open(LoanFacilityDialogTempComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (res.applicationProduct.maturityDate) {
            this.applicationProduct.maturityDate = this.setDate(res);
          }
          this.applicationProduct = res.applicationProduct;
          this.creditProposal.collateralProductRelations = [...res.creditProposal.collateralProductRelations];
          this.onSave(true);

          // save after close dialog, for update summery report coverage
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

            this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
            this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
            this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();
          }
        }
      }
    } else {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.id === appProduct.id;
      });
      this.creditProposal.products[idx] = mark ? appProduct : this.applicationProductStartState;
      this.dataProduct[idx] = mark ? appProduct : this.applicationProductStartState;
      this.dataProduct = [...this.dataProduct];

      this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
      this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
      this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();
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
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          const dataGrid = this.creditProposal.products.filter(obj => obj.nomorUrutFasilitas !== element.nomorUrutFasilitas);
          this.dataProduct = dataGrid;
          this.creditProposal.products = this.dataProduct;

          this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
          this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
          this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();

          // save after close dialog, for update summery report coverage
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

  private setDate(data: any) {
    const getDate = data.applicationProduct.maturityDate;
    const staticDate = moment(new Date(getDate)).format().substring(0, 19) + 'Z';
    return staticDate;
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
          for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
            for (let j = 0; j < res.body.collateralProductRelations.length; j++) {
              if (this.creditProposal.collateralProductRelations[i].id === res.body.collateralProductRelations[j]?.id) {
                this.creditProposal.collateralProductRelations;
              }
              {
                this.creditProposal.collateralProductRelations = res.body.collateralProductRelations;
              }
            }
          }
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

  private loadSummaryCollateralSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const applicationNumber = this.creditProposal.id;
      this.collateralService.getSummaryCollateral(applicationNumber, { page: 0, size: 9999 }).subscribe(
        res => {
          this.dataCollateralSummary = lodash.filter(res.body, function (o) {
            return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
          });
          if (res.body.length > 0) {
            this.getBindingCalculateSummary(this.dataCollateralSummary).then(() => {
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
      this._creditProposal.attributes['coverageTotal'].creditLimit = creditLimit;

      this.totalPlafond = result + dolar;

      resolve();
    });
  }

  public convertNan(value: any): any {
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
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

        this.biddingValueCoverage = Math.round(biddingValueCoverage * 100) / 100;
        this.creditProposal.attributes['coverageTotal'].biddingValueSum = this.biddingValueSum;
        this.creditProposal.attributes['coverageTotal'].biddingValueCoverage = this.biddingValueCoverage;

        this.presentageSummary(String(this.countTotalMVSummary() / this.totalPlafond), 'mv');
        this.presentageSummary(String(this.countTotalLVSummary() / this.totalPlafond), 'lv');
        this.presentageSummary(String(this.countTotalMVKJJPSummary() / this.totalPlafond), 'mvKjjp');
        this.presentageSummary(String(this.countTotalLVKJJPSummary() / this.totalPlafond), 'lvKjjp');
      });
    });
  }

  public countTotalMVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateralSummary;
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
    const collaterals: ICollateral[] = this.dataCollateralSummary;
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
    const collaterals: ICollateral[] = this.dataCollateralSummary;
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
    const collaterals: ICollateral[] = this.dataCollateralSummary;
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
}

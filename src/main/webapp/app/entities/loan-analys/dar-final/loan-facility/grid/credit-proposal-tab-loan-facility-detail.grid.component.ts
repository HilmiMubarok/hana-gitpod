import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IProduct } from 'app/entities/product/product.model';
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

@Component({
  selector: 'jhi-loan-facility-detail-grid-temp',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class LoanFacilityDetailGridTempComponent implements OnInit, OnChanges {
  public dataParty = [];

  @Input() isViewMode: Boolean = false;
  public _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

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
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
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
    // this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
  }
  partyCifFunc() {
    if (this.creditProposal.attributes['loanHobbies'] === 'true' || this.creditProposal.attributes['loanHobbies'] === true) {
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        this.dataParty.push(this.creditProposal.products[i]);
      }
    } else {
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        this.dataParty.push(this.creditProposal.products[i]);
      }
      this.creditProposal.attributes['loanHobbies'] = 'false';
      this.partyCifService
        .queryFilterBy({
          page: 0,
          size: 1,
          idParty: this._creditProposal.cif.partyId,
          sort: ['desc'],
        })
        .subscribe((response: any) => {
          this.dataFunc(response);
        });
    }
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

  dataFunc(response: any) {
    this.partyCifService.find('cif/retrieve-cp-facility/' + response.body[0].customerNumber).subscribe((res: any) => {
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
    if (param) {
      this.applicationProduct = param;
      if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
        this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
      }
      // if (this.applicationProduct.attributes.commitedLine === 'true') {
      //   this.applicationProduct.attributes.commitedLine = true;
      // } else if (this.applicationProduct.attributes.commitedLine === 'false') {
      //   this.applicationProduct.attributes.commitedLine = false;
      // }
      // if (this.applicationProduct.attributes.subLimit === 'true') {
      //   this.applicationProduct.attributes.subLimit = true;
      // } else if (this.applicationProduct.attributes.subLimit === 'false') {
      //   this.applicationProduct.attributes.subLimit = false;
      // }
      // if (this.applicationProduct.attributes.restructuredStatus === 'true') {
      //   this.applicationProduct.attributes.restructuredStatus = true;
      // } else if (this.applicationProduct.attributes.restructuredStatus === 'false') {
      //   this.applicationProduct.attributes.restructuredStatus = false;
      // }
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
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.applicationProduct = res.applicationProduct;
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

            this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
            this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
            this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();

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

  // public onDelete(element: IApplicationProduct) {
  //   const dataGrid = this.creditProposal.products.filter(
  //     ({ attributes }) => attributes['nomorUrutFasilitas'] !== element.attributes['nomorUrutFasilitas']
  //   );
  //   this.dataParty = dataGrid;
  //   this.creditProposal.products = this.dataParty;
  // }

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
}

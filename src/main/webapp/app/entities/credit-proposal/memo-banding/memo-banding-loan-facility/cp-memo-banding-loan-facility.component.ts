import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CreditProposalService } from '../../credit-proposal.service';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { CpMemoBandingService } from '../services/cp-memo-banding.service';
import { MatTableDataSource } from '@angular/material/table';
import _ from 'lodash';

@Component({
  selector: 'jhi-cp-memo-banding-loan-facility',
  templateUrl: './cp-memo-banding-loan-facility.component.html',
  styleUrls: ['../../loan-facility/credit-proposal-tab-loan-facility-detail.css', '../../loan-facility/grid/loan.scss'],
})
export class CpMemoBandingLoanFacilityComponent implements OnInit {
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
  public dataProduct;
  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;

  length: number;
  pageSize = 10;
  pageIndex = 0;

  disabled = false;

  pageEvent: PageEvent;

  totalPlafondCompared;
  custodyFeeCompared;

  public getCurrencyType(element) {
    if (element !== null) {
      return element;
    }
    return '';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public partyCifService: PartyCifService,
    public dialog: MatDialog,
    public _router: Router,
    private creditProposalService: CreditProposalService,
    private cpMemoBandingservice: CpMemoBandingService,
    protected generalParameterService: GeneralParameterService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  parsed;
  custodyFeeStatus;
  totalPlafondStatus;
  customizer(objValue, otherValue, key) {
    if (
      key === 'id'
      // key === 'facilityCategory' ||
      // key === 'applicationType' ||
      // key === 'facilityType' ||
      // key === 'subLimit' ||
      // key === 'currency' ||
      // key === 'initialLimit' ||
      // key === 'outstanding' ||
      // key === 'changes' ||
      // key === 'totalCreditLimit' ||
      // key === 'interestrate' ||
      // key === 'provisionAmount' ||
      // key === 'tenor' ||
      // key === 'maturityDate' ||
      // key === 'firstDisbursementDate'
    ) {
      return true;
    }
    // Return undefined to defer to the default comparison behavior of _.isEqual
    return undefined;
  }

  ngOnInit(): void {
    this.parsed = this.cpMemoBandingservice.parsePrevOfferingLetter(this.creditProposal);

    this.currency();
    // this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    this.lovInterestRateTypeList();

    this.dataProduct = new MatTableDataSource<any>(
      this.cpMemoBandingservice.compareDeepDataNew(this.parsed.products, this.creditProposal.products)
    );

    this.totalPlafondStatus = this.cpMemoBandingservice.compareSingleObject(
      { plafon: this.fungsiSumcredit('both') },
      { plafon: this.fungsiSumcreditAfter('both') }
    );

    console.log('DATA PARSED product', {
      parsed: this.parsed.products,
      cp: this.creditProposal.products,
      totalb: this.fungsiSumcredit('both'),
      totala: this.fungsiSumcreditAfter('both'),
      totals: this.totalPlafondStatus,
    });

    (this.custodyFeeStatus = this.cpMemoBandingservice.compareSingleObject(
      { custodian: this.parsed.facilityDetail.custodianFee },
      { custodian: this.creditProposal.attributes['facilityDetail'].custodianFee }
    )),
      console.log('totaaaa', {
        plafon: {
          before: this.fungsiSumcredit('both'),
          after: this.fungsiSumcreditAfter('both'),
        },
        custodian: {
          before: this.parsed.facilityDetail.custodianFee,
          after: this.creditProposal.attributes['facilityDetail'].custodianFee,
        },
        compared: {
          plafon: this.cpMemoBandingservice.compareSingleObject(
            { plafon: this.fungsiSumcredit('both') },
            { plafon: this.fungsiSumcreditAfter('both') }
          ),
          custodian: this.cpMemoBandingservice.compareSingleObject(
            { custodian: this.parsed.facilityDetail.custodianFee },
            { custodian: this.creditProposal.attributes['facilityDetail'].custodianFee }
          ),
        },
      });
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
    return !element.hobis || this.view;
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
      });
  }

  public getFacilityType(element: IApplicationProduct) {
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

  fungsiSumcredit(value: string) {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.parsed.products.filter(obj => obj.subLimit === false);

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
    return result + dolar;
  }
  fungsiSumcreditAfter(value: string) {
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
    return result + dolar;
  }
}

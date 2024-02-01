import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ICreditProposal } from '../..//credit-proposal.model';

import lodash from 'lodash';
import { ApplicationOptionService } from 'app/entities/application-option/application-option.service';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { CPFacilityTable } from '../total-exposure/cp-facility-table-model';
import { FakeFacilityService } from '../total-exposure/fake-facility-type.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';
import { IMasterParameter } from 'app/entities/master-parameter/master-parameter.model';
import { PARAMETER_TYPE } from 'app/shared/constants/base.constants';
import { CreditProposalService } from '../../credit-proposal.service';
import { Router } from '@angular/router';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-legal-lending',
  templateUrl: './legal-lending.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class LegalLendingComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit, OnChanges {
  // public data = ['25% (Basic)', '30%(BUMN)', '10%(Related Party)'];
  public data: any[];

  public _creditProposal: ICreditProposal;
  public _parameter: IMasterParameter;

  public totalDebiturCashLoan = 0;
  public totalDebiturCashLoanGroup = 0;
  public totalDebiturNonCashLoan = 0;
  public totalDebiturNonCashLoanGroup = 0;
  public grandTotalGroup = 0;
  public totalGroupCashLoan = 0;
  public totalGroupNonCashLoan = 0;
  public grandTotalDebitor = 0;
  public totalWcl = 0;
  public totalDl = 0;
  public totalOD = 0;
  public totalMML = 0;
  public totalFL = 0;
  public totalIL = 0;
  public totalBG = 0;
  public totalLC = 0;
  public init = 0;
  public legalLendingLimitValue = 0;
  public dataSource;
  public modalUsaha: any;
  public parsedAttr;
  public ccy: any;
  public totalExposureDebtorAndGroub: number;
  public currencyMaster = 0;
  public totalWclGroub = 0;
  public totalDlGroub = 0;
  public totalODGroub = 0;
  public totalMMLGroub = 0;
  public totalFLGroub = 0;
  public totalILGroub = 0;
  public totalBGGroub = 0;
  public totalLCGroub = 0;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }
  @Input()
  get parameter() {
    return this._parameter;
  }
  set parameter(item: IMasterParameter) {
    this._parameter = item;
  }
  public generalParameter: IGeneralParameter[];
  constructor(
    protected applicationOptionService: ApplicationOptionService,
    protected fakeFacilityService: FakeFacilityService,
    protected partyCifService: PartyCifService,
    protected _snackbar: MatSnackBar,
    protected generalParameterService: GeneralParameterService,
    public creditProposalService: CreditProposalService,
    public router: Router
  ) {
    super(_snackbar, partyCifService);
  }

  ngOnInit(): void {
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.getApplicationOption();
      this.getParameter();
    });
  }
  public countBuffer(value: number): any {
    // value.toString()
    if (value !== null && value !== undefined) {
      if (value.toString().split('')[0] === '-') {
        const bil = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(value);
        return 'IDR -' + bil.toString().replace('Rp', '').replace('-', '');
      } else {
        const bil = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(value);
        return 'IDR ' + bil.toString().replace('Rp', '');
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.debtorData();
      this.fungsiSuminit();
      this.fungsiSumTotalDebiturCashLoan();
      this.totalCashLoan();
      this.totalNonCashLoan();
      this.grandTotalDebitur();
      this.getMyBusinessGroup();
      // this.getCurrency();
      this.getValueLimit();
    });
  }

  public debtorData() {
    if (this.router.url.split('=').indexOf('exposure') > -1) {
      this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
      if (this.parsedAttr.previousHistory) {
        this.dataSource = this.parsedAttr.previousHistory.products;
      } else {
        this.dataSource = this.creditProposal.products;
      }
    } else {
      this.dataSource = this.creditProposal.products;
    }
  }

  public getApplicationOption() {
    this.applicationOptionService.query().subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        if (res.body[i].id === 'MODAL_INTI_USAHA') {
          this.modalUsaha = res.body[i].value;
        }
      }
    });
  }

  private getParameter(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: PARAMETER_TYPE.LEGALLENDINGLIMIT,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.generalParameter = lodash.filter(res.body, function (o) {
          return o.code !== null && o.statusId === STATUS.ACTIVE;
        });
      });
  }

  fungsiSuminit() {
    const datafilter = this.dataSource.filter(obj => obj['sublimit'] === 'false' || obj['sublimit'] === false);

    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        this.init = this.init + Number(this.dataSource[i].initialLimit);
      }
    }
  }

  fungsiSumTotalDebiturCashLoan() {
    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].subLimit === false || this.dataSource[i].subLimit === 'false') {
        if (this.dataSource[i].currencyId === 'IDR') {
          if (this.dataSource[i].attributes['facilityType'] === 'WCI') {
            if (this.dataSource[i]['applicationType'].toUpperCase() === 'NEW') {
              this.totalWcl = this.totalWcl + Number(this.dataSource[i].totalPlafond);
            } else {
              this.totalWcl = this.totalWcl + Number(this.dataSource[i].outstanding);
            }
          }
          if (this.dataSource[i]['facilityType'] === 'DL') {
            this.totalDl = this.totalDl + Number(this.dataSource[i].totalPlafond);
          }
          if (this.dataSource[i]['facilityType'] === 'MML') {
            this.totalMML = this.totalMML + Number(this.dataSource[i].totalPlafond);
          }
          if (this.dataSource[i]['facilityType'] === 'FL') {
            if (this.dataSource[i]['applicationType'].toUpperCase() === 'NEW') {
              this.totalFL = this.totalFL + Number(this.dataSource[i].totalPlafond);
            } else {
              this.totalFL = this.totalFL + Number(this.dataSource[i].outstanding);
            }
          }
          if (this.dataSource[i].attributes['facilityType'] === 'IL') {
            if (this.dataSource[i]['applicationType'].toUpperCase() === 'NEW') {
              this.totalIL = this.totalIL + Number(this.dataSource[i].totalPlafond);
            } else {
              this.totalIL = this.totalIL + Number(this.dataSource[i].outstanding);
            }
          }
          if (this.dataSource[i]['facilityType'] === 'OD') {
            this.totalOD = this.totalOD + Number(this.dataSource[i].totalPlafond);
          }

          if (this.dataSource[i]['facilityType'] === 'BG') {
            this.totalBG = this.totalBG + Number(this.dataSource[i].totalPlafond);
          }
          if (this.dataSource[i]['facilityType'] === 'LC') {
            this.totalLC = this.totalLC + Number(this.dataSource[i].totalPlafond);
          }
        }

        if (this.dataSource[i].subLimit === false || this.dataSource[i].subLimit === 'false') {
          if (this.dataSource[i].currencyId === 'USD') {
            if (this.dataSource[i].attributes['facilityType'] === 'BG') {
              this.totalBG = this.totalBG + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
            }
            if (this.dataSource[i].attributes['facilityType'] === 'LC') {
              this.totalLC = this.totalLC + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
            }
            if (this.dataSource[i].attributes['facilityType'] === 'WCI') {
              if (this.dataSource[i]['applicationType'].toUpperCase() === 'NEW') {
                this.totalWcl = this.totalWcl + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
              } else {
                this.totalWcl = this.totalWcl + Number(this.dataSource[i].outstanding) * Number(this.dataSource[i].kurs);
              }
            }
            if (this.dataSource[i].attributes['facilityType'] === 'DL') {
              this.totalDl = this.totalDl + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
            }
            if (this.dataSource[i].attributes['facilityType'] === 'MML') {
              this.totalMML = this.totalMML + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
            }
            if (this.dataSource[i].attributes['facilityType'] === 'FL') {
              if (this.dataSource[i]['applicationType'].toUpperCase() === 'NEW') {
                this.totalFL = this.totalFL + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
              } else {
                this.totalFL = this.totalFL + Number(this.dataSource[i].outstanding) * Number(this.dataSource[i].kurs);
              }
            }
            if (this.dataSource[i].attributes['facilityType'] === 'IL') {
              if (this.dataSource[i]['applicationType'].toUpperCase() === 'NEW') {
                this.totalIL = this.totalIL + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
              } else {
                this.totalIL = this.totalIL + Number(this.dataSource[i].outstanding) * Number(this.dataSource[i].kurs);
              }
            }
            if (this.dataSource[i].attributes['facilityType'] === 'OD') {
              this.totalOD = this.totalOD + Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs);
            }
          }
        }
      }
    }
  }
  totalCashLoan() {
    this.totalDebiturCashLoan =
      this.totalDebiturCashLoan + this.totalDl + this.totalWcl + this.totalMML + this.totalFL + this.totalIL + this.totalOD;
  }

  totalNonCashLoan() {
    this.totalDebiturNonCashLoan = this.totalDebiturNonCashLoan + this.totalBG + this.totalLC;
  }

  grandTotalDebitur() {
    this.grandTotalDebitor = this.totalDebiturCashLoan + this.totalDebiturNonCashLoan;
  }

  // Grup

  public init2 = 0;
  public change = 0;
  public os = 0;
  public credit = 0;
  public available = 0;
  public totallimt = 0;
  public totalos = 0;
  public totalchange = 0;
  public totalcredit = 0;
  public totalplafondgroup = 0;
  public totalavilable = 0;
  public change2 = 0;
  public buffer = 0;

  private getMyBusinessGroup(): void {
    this.creditProposalService.applicationGroubProduct(this.creditProposal.id).subscribe((response: any) => {
      // console.log('ggffff', response.body);
      this.filterBusinessGroupDebtorData(response.body);
    });
  }

  private filterBusinessGroupDebtorData(source: any[]): void {
    if (source.length > 0) {
      let no = 0;
      for (let y = 0; y < source.length; y++) {
        const parsed = new CPFacilityTable();
        no = no + 1;
        parsed.no = no;
        parsed.GroupName = source[y].customerName;
        parsed.LoanAccount = source[y].agreementNumber;
        parsed.FacilityType = source[y].productTypeId;
        parsed.InitialLimit = Number(source[y].contractAmount ? source[y].contractAmount : 0);
        parsed.Changes = 0;
        parsed.OS = source[y].outstanding;
        parsed.TotalPlafond = source[y].productRevolving ? parsed.InitialLimit + parsed.Changes : source[y].outstanding;

        parsed.InterestRate =
          source[y].intResetFrequency + ' ' + source[y].intResetPeriod + ' ' + source[y].rateTypeName + ' ' + source[y].spreadRate;
        parsed.Provision = source[y].provisionFeeAmount;
        parsed.AdminFee = source[y].provisionFeeAmount;
        parsed.FirstDisbursementDate = source[y].trxDate;
        parsed.Tenor = source[y].trxDate;
        parsed.LoanType = this.fakeFacilityService.getFacilityType(source[y].productCode);
        parsed.CCY = source[y].baseCurrency;
        parsed.MaturityDate = source[y].maturityDate;

        this.totalplafondgroup = this.totalplafondgroup + parsed.TotalPlafond;
        if (parsed.CCY === 'IDR') {
          if (parsed.FacilityType === 'WCI') {
            this.totalWclGroub = this.totalWclGroub + Number(parsed.OS);
          }
          if (parsed.FacilityType === 'IL') {
            this.totalILGroub = this.totalILGroub + Number(parsed.OS);
          }
          if (parsed.FacilityType === 'FL') {
            this.totalFLGroub = this.totalFLGroub + Number(parsed.OS);
          }
          if (parsed.FacilityType === 'MML') {
            this.totalMMLGroub = this.totalMMLGroub + Number(parsed.TotalPlafond);
          }
          if (parsed.FacilityType === 'DL') {
            this.totalDlGroub = this.totalDlGroub + Number(parsed.TotalPlafond);
          }
          if (parsed.FacilityType === 'OD') {
            this.totalODGroub = this.totalODGroub + Number(parsed.TotalPlafond);
          }
          if (parsed.FacilityType === 'LC') {
            this.totalLCGroub = this.totalLCGroub + Number(parsed.TotalPlafond);
          }

          if (parsed.FacilityType === 'BG') {
            this.totalBGGroub = this.totalBGGroub + Number(parsed.TotalPlafond);
          }
        } else if (parsed.CCY !== 'IDR') {
          if (parsed.FacilityType === 'WCI') {
            this.totalWclGroub = this.totalWclGroub + Number(parsed.OS) * Number(this.currencyMaster);
          }
          if (parsed.FacilityType === 'IL') {
            this.totalILGroub = this.totalILGroub + Number(parsed.OS) * Number(this.currencyMaster);
          }
          if (parsed.FacilityType === 'FL') {
            this.totalFLGroub = this.totalFLGroub + Number(parsed.OS) * Number(this.currencyMaster);
          }
          if (parsed.FacilityType === 'MML') {
            this.totalMMLGroub = this.totalMMLGroub + Number(parsed.TotalPlafond) * Number(this.currencyMaster);
          }
          if (parsed.FacilityType === 'DL') {
            this.totalDlGroub = this.totalDlGroub + Number(parsed.TotalPlafond) * Number(this.currencyMaster);
          }
          if (parsed.FacilityType === 'OD') {
            this.totalODGroub = this.totalODGroub + Number(parsed.TotalPlafond) * Number(this.currencyMaster);
          }
          if (parsed.FacilityType === 'LC') {
            this.totalLCGroub = this.totalLCGroub + Number(parsed.TotalPlafond) * Number(this.currencyMaster);
          }

          if (parsed.FacilityType === 'BG') {
            this.totalBGGroub = this.totalBGGroub + Number(parsed.TotalPlafond) * Number(this.currencyMaster);
          }
        }
      }
    }
    this.totalGroubCashLoanNonCashLoan();
  }
  // currency code
  getCurrency() {
    this.ccy = this.creditProposal.products[0].currency;
  }

  public totalGroubCashLoanNonCashLoan() {
    this.totalDebiturCashLoanGroup =
      this.totalDebiturCashLoanGroup +
      this.totalDlGroub +
      this.totalWclGroub +
      this.totalMMLGroub +
      this.totalFLGroub +
      this.totalILGroub +
      this.totalODGroub;
    this.totalDebiturNonCashLoanGroup = this.totalDebiturNonCashLoanGroup + this.totalBGGroub + this.totalFLGroub;
    this.grandTotalGroup = this.totalDebiturCashLoanGroup + this.totalDebiturNonCashLoanGroup;

    this.exposureDebiturGroubTotal();
  }

  public exposureDebiturGroubTotal() {
    this.totalExposureDebtorAndGroub =
      this.totalDebiturCashLoanGroup + this.totalDebiturNonCashLoanGroup + this.totalDebiturNonCashLoan + this.totalDebiturCashLoan;
  }

  // Select Limit Type
  public legallindingLimitValue(event: any): void {
    for (let i = 0; i < this.generalParameter.length; i++) {
      if (event.value === this.generalParameter[i].code) {
        this.legalLendingLimitValue = (this.modalUsaha * Number(this.generalParameter[i].value)) / 100;
      }
    }
    this.creditProposal.attributes['legalLendingLimit'].legalLendingLimitValue = this.legalLendingLimitValue;
    this.creditProposal.attributes['legalLendingLimit'].modalIntiUtama = this.modalUsaha;
    this.creditProposal.attributes['legalLendingLimit'].totalExposureDebtorGroup =
      this.creditProposal.attributes['calculationExposure'].grandTotalPlafond;
    this.creditProposal.attributes['legalLendingLimit'].buffer =
      this.creditProposal.attributes['legalLendingLimit'].legalLendingLimitValue -
      this.creditProposal.attributes['legalLendingLimit'].totalExposureDebtorGroup;
    this.getValueLimit();
  }

  public getValueLimit(): void {
    if (this.creditProposal.attributes['legalLendingLimit'].buffer > 0) {
      this.creditProposal.attributes['legalLendingLimit'].status = 'comply';
    } else if (this.creditProposal.attributes['legalLendingLimit'].buffer < 0) {
      this.creditProposal.attributes['legalLendingLimit'].status = 'Breach The Limit';
    } else {
      this.creditProposal.attributes['legalLendingLimit'].status = '';
    }
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
}

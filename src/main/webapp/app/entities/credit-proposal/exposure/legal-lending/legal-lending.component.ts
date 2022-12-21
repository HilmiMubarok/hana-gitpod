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
    protected generalParameterService: GeneralParameterService
  ) {
    super(_snackbar, partyCifService);
  }

  ngOnInit(): void {
    this.getApplicationOption();
    this.getParameter();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
    if (this.parsedAttr.previousHistory) {
      console.log('true');
      this.dataSource = this.parsedAttr.previousHistory.products;
    } else {
      console.log('false');
      this.dataSource = this.creditProposal.products;
    }

    console.log('dataSource', {
      dataSource: this.dataSource,
      parsed: this.parsedAttr,
    });

    this.fungsiSuminit();
    this.fungsiSumTotalDebiturCashLoan();
    this.totalCashLoan();
    this.totalNonCashLoan();
    this.grandTotalDebitur();
    this.getMyBusinessGroup();
    this.getCurrency();
  }

  public getApplicationOption() {
    this.applicationOptionService.query().subscribe(res => {
      console.log('res body', res);
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
      })
      .subscribe(res => {
        this.generalParameter = lodash.filter(res.body, function (o) {
          return o.code !== null;
        });
      });
  }

  fungsiSuminit() {
    const datafilter = this.creditProposal.products.filter(
      obj => obj.attributes['sublimit'] === 'false' || obj.attributes['sublimit'] === false
    );

    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        this.init = this.init + Number(this.dataSource[i].attributes.initialLimit);
      }
    }
  }

  fungsiSumTotalDebiturCashLoan() {
    for (let i = 0; i < this.dataSource.length; i++) {
      // cashloan
      if (this.dataSource[i].attributes['facilityType'] === 'WCI') {
        this.totalWcl = this.totalWcl + Number(this.dataSource[i].attributes.initialLimit);
      }
      if (this.dataSource[i].attributes['facilityType'] === 'DL') {
        this.totalDl = this.totalDl + Number(this.dataSource[i].attributes.initialLimit);
      }
      if (this.dataSource[i].attributes['facilityType'] === 'MML') {
        this.totalMML = this.totalMML + Number(this.dataSource[i].attributes.initialLimit);
      }
      if (this.dataSource[i].attributes['facilityType'] === 'FL') {
        this.totalFL = this.totalFL + Number(this.dataSource[i].attributes.initialLimit);
      }
      if (this.dataSource[i].attributes['facilityType'] === 'IL') {
        this.totalIL = this.totalIL + Number(this.dataSource[i].attributes.initialLimit);
      }
      if (this.dataSource[i].attributes['facilityType'] === 'OD') {
        this.totalOD = this.totalOD + Number(this.dataSource[i].attributes.initialLimit);
      }

      if (this.dataSource[i].attributes['facilityType'] === 'BG') {
        this.totalBG = this.totalBG + Number(this.dataSource[i].attributes.initialLimit);
      }
      if (this.dataSource[i].attributes['facilityType'] === 'LC') {
        this.totalLC = this.totalLC + Number(this.dataSource[i].attributes.initialLimit);
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
    this.partyCifService.getMyBusinessGroup(this.creditProposal.customerNumber).subscribe(res => {
      this.filterBusinessGroupDebtorData(res.body);
    });
  }

  private filterBusinessGroupDebtorData(param: IDebtorData[]): void {
    if (param.length > 0) {
      for (let i = 0; i < param.length; i++) {
        const item: IDebtorData = param[i];
        if (lodash.has(item.attributes, 'cpFacility')) {
          const source = JSON.parse(item.attributes['cpFacility']);
          if (source) {
            for (let y = 0; y < source.length; y++) {
              const parsed = new CPFacilityTable();
              parsed.InitialLimit = Number(source[y].FILN10_CONTRACT_AMT ? source[y].FILN10_CONTRACT_AMT : 0);
              parsed.Changes = 0;
              parsed.TotalPlafond = parsed.InitialLimit + parsed.Changes;
              parsed.LoanType = this.fakeFacilityService.getFacilityType(source[y].FILN11_COM_ID);

              if (parsed.LoanType === 'Cash Loan') {
                this.totalDebiturCashLoanGroup = this.totalDebiturCashLoanGroup + parsed.InitialLimit;
              } else if (parsed.LoanType === 'Non Cash Loan') {
                this.totalDebiturNonCashLoanGroup = this.totalDebiturNonCashLoanGroup + parsed.InitialLimit;
              }

              this.totalplafondgroup = this.totalplafondgroup + parsed.TotalPlafond;
            }
          }
        }
      }
    }
    this.grandTotalGroup = this.totalDebiturCashLoanGroup + this.totalDebiturNonCashLoanGroup;
  }
  // currency code
  getCurrency() {
    this.ccy = this.creditProposal.products[0].attributes.currency;
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
    this.creditProposal.attributes['legalLendingLimit'].legalLendingLimitValue = this.legalLendingLimitValue;
    this.creditProposal.attributes['legalLendingLimit'].totalExposureDebtorGroup = this.grandTotalGroup + this.grandTotalDebitor;
    this.creditProposal.attributes['legalLendingLimit'].buffer =
      this.creditProposal.attributes['legalLendingLimit'].legalLendingLimitValue -
      this.creditProposal.attributes['legalLendingLimit'].totalExposureDebtorGroup;

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

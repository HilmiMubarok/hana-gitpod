import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Internationalization } from '@syncfusion/ej2-base';
import lodash from 'lodash';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { FakeFacilityService } from 'app/entities/credit-proposal/exposure/total-exposure/fake-facility-type.service';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
// import { CPFacility, ICPFacility } from './cp-facility.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { CPFacilityTable, ICPFacilityTable } from './cp-facility-table-model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-total-exposure',
  templateUrl: './total-exposure.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class TotalExposureComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit, OnChanges {
  public parsedAttr;
  public dataSource;
  public selectedMenu: string;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public totalDebiturCashLoan = 0;
  public totalDebiturCashLoanGroup = 0;
  public totalDebiturNonCashLoan = 0;
  public totalDebiturNonCashLoanGroup = 0;
  public grandTotalGroup = 0;

  public myBusinessGroup: IDebtorData[];
  // public myBusinessGroupCPFacility: ICPFacility[];
  public myBusinessGroupCPFacility: ICPFacilityTable[];
  public data: string[] = ['25% (Basic)', '30%(BUMN)', '10%(RelatedN Party)'];
  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [
    { text: 'TOTAL EXPOSURE' },
    {
      text: 'INDUSTRY LIMIT EXPOSURE',
    },
    {
      text: 'LEGAL LENDING LIMIT',
    },
  ];

  constructor(
    protected _snackbar: MatSnackBar,
    protected partyCifService: PartyCifService,
    protected fakeFacilityService: FakeFacilityService
  ) {
    super(_snackbar, partyCifService);
    this.myBusinessGroup = [];
    this.myBusinessGroupCPFacility = [];
  }

  public displayColumn: string[] = [
    'no',
    'namegroup',
    'facilityType',
    'initialLimit',
    'change',
    'os',
    'totalPlatfond',
    'interet',
    'provision',
    'adminFee',
    'firstDisbursmentDate',
    'tenor',
  ];

  public numericFormatOptions: Object = { format: 'N' };

  // public data1: Object[] = [];

  // public valueAccess = (field: string, data1: Object, column: Object) => data1[field] = this.format("$ ###.00", data1[field]);

  ngOnInit(): void {
    this.selectedMenu = 'TOTAL EXPOSURE';
    this.setMenu('');
    this.getCurrency();
  }

  private getMyBusinessGroup(): void {
    this.partyCifService.getMyBusinessGroup(this.creditProposal.customerNumber).subscribe(res => {
      this.filterBusinessGroupDebtorData(res.body);
    });
  }

  private filterBusinessGroupDebtorData(param: IDebtorData[]): void {
    if (param.length > 0) {
      let no = 0;
      for (let i = 0; i < param.length; i++) {
        const item: IDebtorData = param[i];
        if (lodash.has(item.attributes, 'cpFacility')) {
          const source = JSON.parse(item.attributes['cpFacility']);
          if (source) {
            for (let y = 0; y < source.length; y++) {
              const parsed = new CPFacilityTable();
              no = no + 1;
              parsed.no = no;
              parsed.GroupName = '';
              parsed.LoanAccount = source[y].LNB_BASE_AGR_REF_NO;
              parsed.FacilityType = source[y].FILN11_COM_NM;
              parsed.InitialLimit = Number(source[y].FILN10_CONTRACT_AMT ? source[y].FILN10_CONTRACT_AMT : 0);
              parsed.Changes = 0;
              parsed.OS = source[y].LNB_BASE_LON_JAN;
              parsed.TotalPlafond = parsed.InitialLimit + parsed.Changes;
              parsed.InterestRate = source[y].FILN10_ROLL_GAP + source[y].FILN10_ROLL_GAP_GB;
              parsed.Provision = source[y].FILN22_FEE_AMT;
              parsed.AdminFee = source[y].FILN22_FEE_AMT;
              parsed.FirstDisbursementDate = source[y].FXFIG_TRX_DT;
              parsed.Tenor = source[y].FILN10_TOT_EXP_IL;
              parsed.LoanType = this.fakeFacilityService.getFacilityType(source[y].FILN11_COM_ID);

              if (parsed.LoanType === 'Cash Loan') {
                this.totalDebiturCashLoanGroup = this.totalDebiturCashLoanGroup + parsed.InitialLimit;
              } else if (parsed.LoanType === 'Non Cash Loan') {
                this.totalDebiturNonCashLoanGroup = this.totalDebiturNonCashLoanGroup + parsed.InitialLimit;
              }

              this.totalplafondgroup = this.totalplafondgroup + parsed.TotalPlafond;
              this.myBusinessGroupCPFacility = lodash.concat(this.myBusinessGroupCPFacility, parsed);
              const removeundefined = lodash.remove(this.myBusinessGroupCPFacility, function (n) {
                return n === undefined;
              });
            }
          }
          // this.myBusinessGroupCPFacility.push(JSON.parse(item.attributes['cpFacility']));
          // this.myBusinessGroupCPFacility.push(parsed);
        }
      }
    }
    console.log('myBusinessGroupCPFacility', this.myBusinessGroupCPFacility);
    console.log('cash loan', this.totalDebiturCashLoanGroup);
    console.log('non cash loan', this.totalDebiturNonCashLoanGroup);
    this.grandTotalGroup = this.totalDebiturCashLoanGroup + this.totalDebiturNonCashLoanGroup;
  }

  format(format: any, value: any): string {
    const intl: Internationalization = new Internationalization();
    const nParser: Function = intl.getNumberParser({
      format,
    });
    const val: string = intl.formatNumber(value, {
      format,
    });
    return val;
  }

  private setMenu(value: string): void {
    this.menuItems = lodash.clone(this.menuItemsAll);
    const compareVal = value === '' ? this.creditProposal.attributes.proposalType : value;
    if (compareVal === 'Total Exposure > IDR 15 Bn') {
      this.spliceMenus(['TOTAL EXPOSURE,LEGAL LENDING LIMIT,INDUSTRY LIMIT EXPOSURE']);
      if (compareVal === 'Total Exposure Back to Back') {
        this.spliceMenus(['TOTAL EXPOSURE']);
      }
      if (compareVal === 'Total Exposure < IDR 15 Bn') {
        this.spliceMenus(['TOTAL EXPOSURE']);
      }
    } else {
      this.spliceMenus(['INDUSTRY LIMIT EXPOSURE, LEGAL LENDING LIMIT,TOTAL EXPOSURE']);
    }
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }

  private spliceMenus(menus: string[]): void {
    for (let i = 0; i < menus.length; i++) {
      for (let j = 0; j < this.menuItems.length; j++) {
        if (this.menuItems[j].text === menus[i]) {
          this.menuItems.splice(j, 1);
        }
      }
    }
  }

  public masterData = {
    CashLoan: ['WCI', 'DL', 'MML', 'FL', 'IL', 'OD'],
    NonCahsLoan: ['BG', 'LC'],
  };

  public init = 0;
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
  public _item: ICreditProposal = new CreditProposal();
  public dataGrid: any = [];
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

  public _creditProposal: ICreditProposal;
  public itemCollateral: ICreditProposal;
  public _exposure: string;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input()
  // get projectAnalysis() {
  //   return this._exposure;
  // }
  // set projectAnalysis(item: any) {
  //   this.selectedMenu = 'TOTAL EXPOSURE';
  // }

  // @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
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
    this.fungsiSumchange();
    this.fungsiSumOS();
    this.fungsiSumcredit();
    this.fungsiSumavailable();
    this.fungsiSumTotalDebiturCashLoan();
    this.totalCashLoan();
    this.totalNonCashLoan();
    this.getMyBusinessGroup();
    this.grandTotalDebitur();
  }

  totalCashLoan() {
    this.totalDebiturCashLoan =
      this.totalDebiturCashLoan + this.totalDl + this.totalWcl + this.totalMML + this.totalFL + this.totalIL + this.totalOD;
  }

  totalNonCashLoan() {
    this.totalDebiturNonCashLoan = this.totalDebiturNonCashLoan + this.totalBG + this.totalLC;
  }

  grandTotalDebitur() {
    console.log(this.totalDebiturCashLoan, this.totalDebiturNonCashLoan);
    this.grandTotalDebitor = this.totalDebiturCashLoan + this.totalDebiturNonCashLoan;
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

  fungsiSumcredit() {
    this.totalcredit = this.change + this.init;
  }

  fungsiSuminit() {
    const datafilter = this.creditProposal.products.filter(
      obj => obj.attributes['sublimit'] === 'false' || obj.attributes['sublimit'] === false
    );
    console.log('SUMINIT', this.dataSource);

    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        // if (this.dataSource[i].attributes.initialLimit === undefined) {
        //   // console.log('masuk limit');
        //   // console.log('initial limit', this.dataSource[i].attributes.initialLimit);
        // } else {
        //   this.init = this.init + Number(this.dataSource[i].attributes.initialLimit);
        // }
        this.init = this.init + Number(this.dataSource[i].attributes.initialLimit);
      }
    }
  }

  fungsiSumchange() {
    const datafilter = this.creditProposal.products.filter(
      obj => obj.attributes['sublimit'] === 'false' || obj.attributes['sublimit'] === false
    );
    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].attributes.changes === undefined) {
          // console.log('masuk');
        } else {
          this.change = this.change + Number(this.dataSource[i].attributes.changes);
          // console.log(this.dataSource[i].attributes.changes);
        }
      }
    }
  }
  fungsiSumOS() {
    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['sublimit'] === 'false' || obj.attributes['sublimit'] === false
    );

    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].attributes.outstanding === undefined) {
          // console.log('masuk');
        } else {
          this.os = this.os + Number(this.dataSource[i].attributes.outstanding);
          // console.log(this.dataSource[i].attributes.outstanding);
        }
      }
    }
  }
  fungsiSumavailable() {
    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].attributes.availableLimit === undefined) {
        // console.log('tidak masuk available');
      } else {
        this.available = this.available + Number(this.dataSource[i].attributes.availableLimit);
        // console.log('ada available');
        // console.log(this.dataSource[i].attributes.availableLimit);
      }
    }
  }

  // currency code
  public ccy: any;
  getCurrency() {
    this.ccy = this.creditProposal.products[0].attributes.currency;
  }

  print() {
    // console.log('item nih', this._creditProposal);
  }
}

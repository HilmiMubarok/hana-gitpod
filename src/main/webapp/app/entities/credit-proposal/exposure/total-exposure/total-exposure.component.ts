import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
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
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'jhi-total-exposure',
  templateUrl: './total-exposure.component.html',
  styleUrls: ['../../loan-facility/grid/loan.scss'],
})
export class TotalExposureComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit, OnChanges, AfterViewInit {
  public parsedAttr;
  public dataSource;
  public selectedMenu: string;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

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
    protected fakeFacilityService: FakeFacilityService,
    public creditProposalService: CreditProposalService
  ) {
    super(_snackbar, partyCifService);
    this.myBusinessGroup = [];
    this.myBusinessGroupCPFacility = [];
  }

  public displayColumn: string[] = [
    'no',
    'facilityType',
    'availableLimit',
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
  public displayColumns: string[] = [
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
  public currencyMaster: any;

  // public data1: Object[] = [];

  // public valueAccess = (field: string, data1: Object, column: Object) => data1[field] = this.format("$ ###.00", data1[field]);
  public busines: any;
  public debtor: any;
  ngOnInit(): void {
    this.selectedMenu = 'TOTAL EXPOSURE';
    this.defaultCurrency();
    this.setMenu('');
    this.getCurrency();

    // this.getInteres();
  }

  ngAfterViewInit(): void {
    let a = [];
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      a = lodash.concat(a, this.creditProposal.products[i]);
    }
    this.debtor = new MatTableDataSource(a);
    this.debtor.paginator = this.paginator2;
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
              parsed.InterestRate =
                source[y].FILN10_ROLL_GAP +
                // source[y].FILN10_ROLL_GAP_GB +
                source[y].FILN11_FIX_FLT_GB +
                // source[y].FIX_FLT_GB +
                source[y].FILN11_SPREAD_RT;
              parsed.Provision = source[y].FILN22_FEE_AMT;
              parsed.AdminFee = source[y].FILN22_FEE_AMT;
              parsed.FirstDisbursementDate = source[y].FXFIG_TRX_DT;
              parsed.Tenor = source[y].FILN10_TOT_EXP_IL;
              parsed.LoanType = this.fakeFacilityService.getFacilityType(source[y].FILN11_COM_ID);
              parsed.CCY = source[y].LNB_BASE_LON_CCY;

              if (parsed.LoanType === 'Cash Loan') {
                this.totalDebiturCashLoanGroup = this.totalDebiturCashLoanGroup + parsed.InitialLimit;
              } else if (parsed.LoanType === 'Non Cash Loan') {
                this.totalDebiturNonCashLoanGroup = this.totalDebiturNonCashLoanGroup + parsed.InitialLimit;
              }

              this.totalplafondgroup = this.totalplafondgroup + parsed.TotalPlafond;
              this.myBusinessGroupCPFacility = lodash.concat(this.myBusinessGroupCPFacility, parsed);
              this.busines = new MatTableDataSource(this.myBusinessGroupCPFacility);
              this.busines.paginator = this.paginator;
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
    // console.log('cp facilit', this.item.attributes['cpFacility']);
    // console.log('myBusinessGroupCPFacility', this.myBusinessGroupCPFacility);
    // console.log('cash loan', this.totalDebiturCashLoanGroup);
    // console.log('non cash loan', this.totalDebiturNonCashLoanGroup);
    this.grandTotalGroup = this.totalDebiturCashLoanGroup + this.totalDebiturNonCashLoanGroup;
  }

  // private findCif(): void {
  //   this.partyCifService.findCif(this.creditProposal.customerNumber).subscribe(res => {
  //     this.filterGroupDebtor(res.body[0]);
  //   });
  // }
  // private filterGroupDebtor(param: IDebtorData[]): void {
  //   if (param.length > 0) {
  //     let no = 0;
  //     for (let i = 0; i < param.length; i++) {
  //       const item: IDebtorData = param[i];
  //       if (lodash.has(item.attributes, 'cpFacility')) {
  //         const inter = JSON.parse(item.attributes['cpFacility']);
  //         if (inter) {
  //           for (let y = 0; y < inter.length; y++) {
  //             const parset = new CPFacilityTable();
  //             no = no + 1;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

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
      let a = [];
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        a = lodash.concat(a, this.creditProposal.products[i]);
      }
      this.debtor = new MatTableDataSource(a);
      this.debtor.paginator = this.paginator2;
    }

    console.log('dataSource', {
      dataSource: this.dataSource,
      parsed: this.parsedAttr,
      debtor: this.debtor,
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

  fungsiSuminit() {
    // alert('ok');
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.initialLimit !== undefined) {
            // console.log("rupiah", filterIdr[i].attributes.initialLimit);
            result = result + Number(filterIdr[i].attributes.initialLimit);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.initialLimit !== undefined) {
            // console.log("dolar", filterUsd[i].attributes.initialLimit);
            // console.log("kurs ", filterUsd[i].attributes.kurs);
            dolar = dolar + Number(filterUsd[i].attributes.initialLimit) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  fungsiSumchange() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.changes !== undefined) {
            // console.log("rupiah", filterIdr[i].attributes.initialLimit);
            result = result + Number(filterIdr[i].attributes.changes);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.changes !== undefined) {
            // console.log("dolar", filterUsd[i].attributes.initialLimit);
            // console.log("kurs ", filterUsd[i].attributes.kurs);
            dolar = dolar + Number(filterUsd[i].attributes.changes) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  public fungsiSumOS() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.outstanding !== undefined) {
            // console.log("rupiah", filterIdr[i].attributes.initialLimit);
            result = result + Number(filterIdr[i].attributes.outstanding);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.outstanding !== undefined) {
            // console.log("dolar", filterUsd[i].attributes.outstanding);
            // console.log("kurs ", filterUsd[i].attributes.kurs);
            dolar = dolar + Number(filterUsd[i].attributes.outstanding) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;

    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.availableLimit !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.availableLimit);
        }
      }
    }
    return result;
  }

  fungsiSumcredit() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.totalPlafond !== undefined) {
            // console.log("rupiah", filterIdr[i].attributes.initialLimit);
            result = result + Number(filterIdr[i].attributes.totalPlafond);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.totalPlafond !== undefined) {
            // console.log('dolar', filterUsd[i].attributes.totalPlafond);
            // console.log("kurs ", filterUsd[i].attributes.kurs);
            dolar = dolar + Number(filterUsd[i].attributes.totalPlafond) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  fungsiSumchangeGroub() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].Changes !== undefined) {
          // console.log("rupiah", filterIdr[i].attributes.initialLimit);
          result = result + Number(filterIdr[i].Changes);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].Changes !== undefined) {
          // console.log("dolar", filterUsd[i].attributes.initialLimit);
          // console.log("kurs ", filterUsd[i].attributes.kurs);
          dolar = dolar + Number(filterUsd[i].Changes) * Number(this.currencyMaster);
        }
      }
    }

    return result + dolar;
  }

  fungsiSumcreditGroub() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].TotalPlafond !== undefined) {
          // console.log("rupiah", filterIdr[i].attributes.initialLimit);

          result = result + Number(filterIdr[i].TotalPlafond);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].TotalPlafond !== undefined) {
          // console.log('dolar', filterUsd[i].attributes.totalPlafond);
          // console.log("kurs ", filterUsd[i].attributes.kurs);
          dolar = dolar + Number(filterUsd[i].TotalPlafond) * Number(this.currencyMaster);
        }
      }
    }

    return result + dolar;
  }

  fungsiSuminitGroub() {
    // alert('ok');
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].InitialLimit !== undefined) {
          // console.log("rupiah", filterIdr[i].attributes.initialLimit);
          result = result + Number(filterIdr[i].InitialLimit);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterIdr[i].InitialLimit !== undefined) {
          // console.log("dolar", filterUsd[i].attributes.initialLimit);
          // console.log("kurs ", filterUsd[i].attributes.kurs);
          dolar = dolar + Number(filterIdr[i].InitialLimit) * Number(this.currencyMaster);
        }
      }
    }

    return result + dolar;
  }

  public fungsiSumOSGroub() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].OS !== undefined) {
          // console.log("rupiah", filterIdr[i].attributes.initialLimit);
          result = result + Number(filterIdr[i].OS);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].OS !== undefined) {
          // console.log("dolar", filterUsd[i].attributes.outstanding);
          // console.log("kurs ", filterUsd[i].attributes.kurs);
          dolar = dolar + Number(filterUsd[i].OS) * Number(this.currencyMaster);
        }
      }
    }

    return result + dolar;
  }

  public defaultCurrency() {
    const setDate = new Date().toISOString().split('T')[0];

    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyMaster = res.body[0]?.factor;
    });
  }

  // currency code
  public ccy: any;
  getCurrency() {
    this.ccy = this.creditProposal.products[0].attributes.currency;
  }

  public getCurrency1(element: IApplicationProduct) {
    if (element.attributes.provitionFeeRateAmountType === 'Amount IDR') {
      return 'IDR';
    }

    if (element.attributes.provitionFeeRateAmountType === 'Amount USD') {
      return 'USD';
    }
    return '';
  }

  public getCurrency2(element: IApplicationProduct) {
    if (element.attributes.provitionFeeRateAmountType === '%p.a') {
      return '%p.a';
    }
    return '';
  }
  public getCurrency3(element: IApplicationProduct) {
    if (element.attributes.adminFeeRateAmountType === 'Amount IDR') {
      return 'IDR';
    }

    if (element.attributes.adminFeeRateAmountType === 'Amount USD') {
      return 'USD';
    }
    return '';
  }

  public getCurrency4(element: IApplicationProduct) {
    if (element.attributes.adminFeeRateAmountType === '%p.a') {
      return '%p.a';
    }
    return '';
  }
  // public getInteres() {
  //   this.partyCifService
  //     .queryFilterBy({
  //       idParty: this.creditProposal.cif.partyId,
  //     })
  //     .subscribe((res: any) => {
  //       this.loadInteres(this.partyCifService.findPartyId(res.body[0]));
  //     });
  // }
  // public inter: any;
  // public loadInteres(_data: string = null): void {
  //   this.partyCifService
  //     .queryFilterBy({
  //       data: _data,
  //     })
  //     .subscribe((res: any) => {
  //       this.inter = res.body[0];
  //       console.log('inters ', res);
  //     });
  // }
}

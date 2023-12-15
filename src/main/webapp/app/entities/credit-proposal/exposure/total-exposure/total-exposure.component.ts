import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Internationalization } from '@syncfusion/ej2-base';
import lodash from 'lodash';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { FakeFacilityService } from 'app/entities/credit-proposal/exposure/total-exposure/fake-facility-type.service';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { CPFacilityTable, ICPFacilityTable } from './cp-facility-table-model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'jhi-total-exposure',
  templateUrl: './total-exposure.component.html',
  styleUrls: ['../../loan-facility/grid/loan.scss', './total-exposure.style.scss'],
})
export class TotalExposureComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit, OnChanges, AfterViewInit {
  public parsedAttr;
  public dataSource = [];
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
  public id: number;

  public myBusinessGroup: IDebtorData[];
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
    public creditProposalService: CreditProposalService,
    public router: Router,
    private activatedRoute: ActivatedRoute
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
    'maturityDate',
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

    'firstDisbursmentDate',
    'tenor',
  ];

  public nonCashLoan = ['BG', 'LC'];

  public numericFormatOptions: Object = { format: 'N' };
  public currencyMaster: any;
  public busines: any;
  public debtor: any;
  ngOnInit(): void {
    this.selectedMenu = 'TOTAL EXPOSURE';
    const setDate = new Date().toISOString().split('T')[0];
    this.setMenu('');

    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyMaster = res.body[0]?.factor;
      this.creditProposal.attributes['calculationExposure'].initialLimitGroub = this.fungsiSuminitGroub();
      this.creditProposal.attributes['calculationExposure'].totalChangeGroub = this.fungsiSumchangeGroub();
      this.creditProposal.attributes['calculationExposure'].subTotalLimitGroubOs = this.fungsiSumOSGroub();
      this.creditProposal.attributes['calculationExposure'].totalPLafondGroub = this.fungsiSumcreditGroub();
      this.creditProposal.attributes['calculationExposure'].totalPsrGroup = this.countTotalPsrGroup();

      this.creditProposal.attributes['calculationExposure'].initialLimitDebtor = this.fungsiSuminit();
      this.creditProposal.attributes['calculationExposure'].totalChangeDebtor = this.fungsiSumchange();
      this.creditProposal.attributes['calculationExposure'].subTotalDebtor = this.fungsiSumOS();
      this.creditProposal.attributes['calculationExposure'].totalPLafondDebtor = this.fungsiSumcredit();
      this.creditProposal.attributes['calculationExposure'].totalPsrDebitur = this.countTotalPsrDebitur();
      this.creditProposal.attributes['calculationExposure'].totalShortTermLoanDebitur = this.countShortTermLoanDebitur();
      this.creditProposal.attributes['calculationExposure'].totalLongTermLoanDebitur = this.countLongThermLoanDebitur();

      this.getCurrency();

      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.cpGroub();
      });
    });
  }

  public cpGroub() {
    this.creditProposalService.applicationGroubProduct(this.id).subscribe((response: any) => {
      // console.log('ggffff', response.body);
      this.filterBusinessGroupDebtorData(response.body);
    });
  }

  ngAfterViewInit(): void {
    this.debtorData();
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
        parsed.CCY = source[y].loanCurrency;
        parsed.MaturityDate = source[y].maturityDate;

        this.totalplafondgroup = this.totalplafondgroup + parsed.TotalPlafond;
        this.myBusinessGroupCPFacility = lodash.concat(this.myBusinessGroupCPFacility, parsed);
        this.busines = new MatTableDataSource(this.myBusinessGroupCPFacility);
        this.busines.paginator = this.paginator;
      }
      this.calculateCashLoanNonCashLoanGroub(this.myBusinessGroupCPFacility);
    }

    this.grandTotalGroup = this.totalDebiturCashLoanGroup + this.totalDebiturNonCashLoanGroup;
  }

  public calculateCashLoanNonCashLoanGroub(busines: any[]) {
    const nonCashLoan = [];

    // pengelompokan non cash loan
    for (let i = 0; i < busines.length; i++) {
      for (let j = 0; j < this.nonCashLoan.length; j++) {
        if (busines[i].FacilityType === this.nonCashLoan[j]) {
          nonCashLoan.push(busines[i]);
        }
      }
    }

    for (let i = 0; i < nonCashLoan.length; i++) {
      if (nonCashLoan[i].CCY === 'IDR') {
        this.totalDebiturNonCashLoanGroup = this.totalDebiturNonCashLoanGroup + nonCashLoan[i].InitialLimit;
      }

      if (nonCashLoan[i].CCY === 'USD') {
        this.totalDebiturNonCashLoanGroup = this.totalDebiturNonCashLoanGroup + nonCashLoan[i].InitialLimit * Number(this.currencyMaster);
      }
    }

    this.totalDebiturCashLoanGroup = this.fungsiSumcreditGroub() - this.totalDebiturNonCashLoanGroup;
    this.creditProposal.attributes['calculationExposure'].totalGroubCashLoan = Number(this.totalDebiturCashLoanGroup);
    this.creditProposal.attributes['calculationExposure'].totalGroubNonCashLoan = Number(this.totalDebiturNonCashLoanGroup);
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
    if (compareVal === 'Total Exposure > IDR 15 Bio') {
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

  public cashLoanDebitur = [];
  public nonCashLoanDebitur = [];

  public _creditProposal: ICreditProposal;
  public itemCollateral: ICreditProposal;
  public _exposure: string;
  public totalChanges: any;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  // @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  ngOnChanges(changes: SimpleChanges) {
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyMaster = res.body[0]?.factor;

      this.debtorData();
      this.debtorData();
      this.fungsiSuminit();
      this.fungsiSumchange();
      this.fungsiSumOS();
      this.fungsiSumcredit();
      this.fungsiSumavailable();
      this.fungsiSumTotalDebiturCashLoan();
      this.totalNonCashLoan();
      this.totalCashLoan();

      this.grandTotalDebitur();

      this.creditProposal.attributes['calculationExposure'].initialLimitDebtor = this.fungsiSuminit();
      this.creditProposal.attributes['calculationExposure'].totalChangeDebtor = this.fungsiSumchange();
      this.creditProposal.attributes['calculationExposure'].subTotalDebtor = this.fungsiSumOS();
      this.creditProposal.attributes['calculationExposure'].totalPLafondDebtor = this.fungsiSumcredit();
    });
  }

  public minusChange(value: number) {
    return value;
  }

  public debtorData() {
    let a = [];

    if (this.router.url.split('=').indexOf('exposure') > -1) {
      this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
      if (this.parsedAttr.previousHistory) {
        this.dataSource = this.parsedAttr.previousHistory.products;

        for (let i = 0; i < this.parsedAttr.previousHistory.products.length; i++) {
          a = lodash.concat(a, this.parsedAttr.previousHistory.products[i]);
        }
      } else {
        this.dataSource = this.creditProposal.products;

        for (let i = 0; i < this.creditProposal.products.length; i++) {
          a = lodash.concat(a, this.creditProposal.products[i]);
        }
      }
      // console.log('if jalan');
    } else {
      // console.log('else jalan');
      this.dataSource = this.creditProposal.products;

      for (let i = 0; i < this.creditProposal.products.length; i++) {
        a = lodash.concat(a, this.creditProposal.products[i]);
      }
    }

    this.debtor = new MatTableDataSource(a);

    this.debtor.paginator = this.paginator2;
  }

  totalCashLoan() {
    if (this.nonCashLoanDebitur.length > 0) {
      this.totalDebiturCashLoan = this.fungsiSumcredit() - this.nonCashLoanDebitur.reduce((acc, cur) => acc + cur);
      this.creditProposal.attributes['calculationExposure'].totalDebiturCashLoan = this.totalDebiturCashLoan;
    } else {
      this.totalDebiturCashLoan = this.fungsiSumcredit() - 0;
      this.creditProposal.attributes['calculationExposure'].totalDebiturCashLoan = this.totalDebiturCashLoan;
    }
  }

  totalNonCashLoan() {
    if (this.nonCashLoanDebitur.length > 0) {
      this.totalDebiturNonCashLoan = this.nonCashLoanDebitur.reduce((acc, cur) => acc + cur);

      this.creditProposal.attributes['calculationExposure'].totalDebiturNonCashLoan = this.totalDebiturNonCashLoan;
    } else {
      this.totalDebiturNonCashLoan = 0;
      this.creditProposal.attributes['calculationExposure'].totalDebiturNonCashLoan = this.totalDebiturNonCashLoan;
    }
  }

  grandTotalDebitur() {
    this.grandTotalDebitor = this.totalDebiturCashLoan + this.totalDebiturNonCashLoan;
  }

  fungsiSumTotalDebiturCashLoan() {
    for (let i = 0; i < this.dataSource.length; i++) {
      if (this.dataSource[i].subLimit === false || this.dataSource[i].subLimit === 'false') {
        for (let j = 0; j < this.nonCashLoan.length; j++) {
          if (this.dataSource[i].currencyId === 'IDR') {
            if (this.dataSource[i].productTypeId === this.nonCashLoan[j]) {
              this.nonCashLoanDebitur = [...this.nonCashLoanDebitur, Number(this.dataSource[i].totalPlafond)];
            }
          } else {
            if (this.dataSource[i].productTypeId === this.nonCashLoan[j]) {
              this.nonCashLoanDebitur = [
                ...this.nonCashLoanDebitur,
                Number(this.dataSource[i].totalPlafond) * Number(this.dataSource[i].kurs),
              ];
            }
          }
        }
      }
    }
  }

  public grandTotalPlafond() {
    this.creditProposal.attributes['calculationExposure'].grandTotalPlafond = this.fungsiSumcredit() + this.fungsiSumcreditGroub();
    return this.creditProposal.attributes['calculationExposure'].grandTotalPlafond;
  }

  fungsiSuminit() {
    let result: number;
    let dolar: number;
    let hasil: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].initialLimit !== null) {
            result = result + Number(filterIdr[i].initialLimit);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].initialLimit !== undefined) {
            dolar = dolar + Number(filterUsd[i].initialLimit) * Number(filterUsd[i].kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  fungsiSumchange() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].changes !== null) {
            result = result + Number(filterIdr[i].changes);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].changes !== null) {
            dolar = dolar + Number(filterUsd[i].changes) * Number(filterUsd[i].kurs);
          }
        }
      }
    }
    this.totalChanges = result + dolar;
    this.creditProposalService.setTotalChanges(this.totalChanges);
    return result + dolar;
  }

  public fungsiSumOS() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].outstanding !== null) {
            result = result + Number(filterIdr[i].outstanding);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].outstanding !== null) {
            dolar = dolar + Number(filterUsd[i].outstanding) * Number(filterUsd[i].kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;

    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].availableLimit !== null) {
          result = result + Number(this.dataSource[i].availableLimit);
        }
      }
    }
    return result;
  }

  fungsiSumcredit() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.currencyId !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].totalPlafond !== undefined) {
            result = result + Number(filterIdr[i].totalPlafond);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].totalPlafond !== undefined) {
            dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
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
          result = result + Number(filterIdr[i].Changes);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].Changes !== undefined) {
          dolar = Number(filterUsd[i].Changes) * Number(this.currencyMaster) + dolar;
        }
      }
    }
    this.creditProposal.attributes['calculationExposure'].totalChangeGroub = result + dolar;
    return result + dolar;
  }

  fungsiSumcreditGroub() {
    let result = 0;
    let dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].TotalPlafond !== undefined) {
          result = result + Number(filterIdr[i].TotalPlafond);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].TotalPlafond !== undefined) {
          dolar = Number(filterUsd[i].TotalPlafond) * Number(this.currencyMaster) + dolar;
        }
      }
    }
    this.creditProposal.attributes['calculationExposure'].totalPLafondGroub = result + dolar;

    return result + dolar;
  }

  fungsiSuminitGroub() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');

    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].InitialLimit !== undefined) {
          result = result + Number(filterIdr[i].InitialLimit);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].InitialLimit !== undefined) {
          dolar = Number(filterUsd[i].InitialLimit) * Number(this.currencyMaster) + dolar;
        }
      }
    }
    this.creditProposal.attributes['calculationExposure'].initialLimitGroub = result + dolar;
    return result + dolar;
  }

  public fungsiSumOSGroub() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].OS !== undefined) {
          result = result + Number(filterIdr[i].OS);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].OS !== undefined) {
          dolar = Number(filterUsd[i].OS) * Number(this.currencyMaster) + dolar;
        }
      }
    }
    this.creditProposal.attributes['calculationExposure'].subTotalLimitGroubOs = result + dolar;
    return result + dolar;
  }

  // currency code
  public ccy: any;
  getCurrency() {
    this.ccy = this.creditProposal.products[0].currencyId;
  }

  public getCurrency1(element: IApplicationProduct) {
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
  public getCurrency3(element: IApplicationProduct) {
    if (element.adminFeeType === 'Amount IDR') {
      return 'IDR';
    }

    if (element.adminFeeType === 'Amount USD') {
      return 'USD';
    }
    return '';
  }

  public getCurrency4(element: IApplicationProduct) {
    if (element.adminFeeType === '%p.a') {
      return '%p.a';
    }
    return '';
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

  public printElements(element) {
    if (element === null || element === 'null') {
      return 0;
    }
    return element;
  }

  public getFacilityType(element: IApplicationProduct) {
    if (element.productTypeId !== undefined && element.productTypeId !== null) {
      return element.productTypeId;
    } else if (element.attributes.facilityType) {
      element.productTypeId = element.attributes.facilityType;
      return element.attributes.facilityType;
    }
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

  public countTotalPsrGroup() {
    let result = 0;
    let dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].TotalPlafond !== undefined) {
          if (filterIdr[i].FacilityType === 'FX') {
            result = result + Number(filterIdr[i].TotalPlafond);
          }
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].TotalPlafond !== undefined) {
          if (filterUsd[i].FacilityType === 'FX') {
            dolar = Number(filterUsd[i].TotalPlafond) * Number(this.currencyMaster) + dolar;
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
}

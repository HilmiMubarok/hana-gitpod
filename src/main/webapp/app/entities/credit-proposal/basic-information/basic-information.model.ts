import { StringFilterUI } from '@syncfusion/ej2-angular-grids';

export interface IBasicInformationWatchListDebtors {
  isDebtor?: string;
  Classification?: string;
}

export class BasicInformationWatchListDebtors implements IBasicInformationWatchListDebtors {
  constructor(public isDebtor?: string, public Classification?: string) {
    this.isDebtor = '';
    this.Classification = '';
  }
}

export interface IBasicInformationAccountStatus {
  watchList?: boolean;
  restuctured?: boolean;
  relatedParty?: boolean;
}

export class BasicInformationAccountStatus implements IBasicInformationAccountStatus {
  constructor(public watchList?: boolean, public restructured?: boolean, public relatedParty?: boolean) {
    this.watchList = false;
    this.restructured = false;
    this.relatedParty = false;
  }
}

export interface IBasicInformation {
  accountStatus?: IBasicInformationAccountStatus;
  watchlistDebtors?: IBasicInformationWatchListDebtors;
  remark?: string;
}

export class BasicInformation implements IBasicInformation {
  constructor(
    public accountStatus?: IBasicInformationAccountStatus,
    public watchlistDebtors?: IBasicInformationWatchListDebtors,
    public remark?: string,
    public bookingBranch?: string,
    public refferal?: string,
    public umkm?: string,
    public customerStatus?: string,
    public categoryDebitur?: string,
    public depossitCapitals?: string,
    public annualSales?: string,
    public collectabilityStatus?: string,
    public ifcRiskCategory?: string,
    public coborowed?: any[],
    public pic?: string,
    public fax?: string,
    public lineOfBusiness?: string,
    public sidCode?: string,
    public sid?: string,
    public codeLbu?: string,
    public lbuRemark?: string,
    public accountNumbUsd?: string,
    public report?: string
  ) {
    this.accountStatus = new BasicInformationAccountStatus();
    this.watchlistDebtors = new BasicInformationWatchListDebtors();
    this.bookingBranch = '';
    this.refferal = '';
    this.remark = '';
    this.umkm = '';
    this.customerStatus = '';
    this.categoryDebitur = '';
    this.depossitCapitals = '';
    this.annualSales = '';
    this.collectabilityStatus = '';
    this.ifcRiskCategory = '';
    this.coborowed = [];
    this.pic = '';
    this.fax = '';
    this.lineOfBusiness = '';
    this.sidCode = '';
    this.sid = '';
    this.codeLbu = '';
    this.lbuRemark = '';
    this.accountNumbUsd = '';
    this.report = '';
  }
}

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
    public remark?: string
  ) {
    this.accountStatus = new BasicInformationAccountStatus();
    this.watchlistDebtors = new BasicInformationWatchListDebtors();

    this.remark = '';
  }
}

export interface IBasicInformationBusinessActivity {
  visitBy?: string;
  visitWith?: string;
  visitDate?: string;
  positionInCompany?: string;
  venue?: string;
  notes?: string;
}

export class BasicInformationBusinessActivity implements IBasicInformationBusinessActivity {
  constructor(
    public visitBy?: string,
    public visitWith?: string,
    public visitDate?: string,
    public positionInCompany?: string,
    public venue?: string,
    public notes?: string
  ) {
    this.visitBy = '';
    this.visitWith = '';
    this.visitDate = '';
    this.positionInCompany = '';
    this.venue = '';
    this.notes = '';
  }
}
// ----------------------------------------------------------------

export interface IBasicInformationWatchListDebtors {
  isDebtorListedonWatchlistorResturing?: string;
  areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory?: string;
}

export class BasicInformationWatchListDebtors implements IBasicInformationWatchListDebtors {
  constructor(
    public isDebtorListedonWatchlistorResturing?: string,
    public areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory?: string
  ) {
    this.isDebtorListedonWatchlistorResturing = '';
    this.areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory = '';
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

// ---------------------------------------------------------------

export interface IBasicInformation {
  accountStatus?: IBasicInformationAccountStatus;
  watchlistDebtors?: IBasicInformationWatchListDebtors;
  remark?: string;
  businessActivity?: IBasicInformationBusinessActivity;
}

export class BasicInformation implements IBasicInformation {
  constructor(
    public accountStatus?: IBasicInformationAccountStatus,
    public watchlistDebtors?: IBasicInformationWatchListDebtors,
    public remark?: string,
    public businessActivity?: IBasicInformationBusinessActivity
  ) {
    this.accountStatus = new BasicInformationAccountStatus();
    this.watchlistDebtors = new BasicInformationWatchListDebtors();
    this.businessActivity = new BasicInformationBusinessActivity();
    this.remark = '';
  }
}

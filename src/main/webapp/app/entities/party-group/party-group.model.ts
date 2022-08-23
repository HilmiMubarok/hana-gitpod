export interface IPartyGroup {
  id?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  cif?: number;
  name?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  partyTypeId?: string;
  partyTypeDescription?: string;
  npwp?: string;
  groupName?: string;
  prefix?: string;
  afiks?: string;
  officePhone?: string;
  otherPhone?: string;
  officeMail?: string;
  faxOffice?: string;
  taxIdNumber?: string;
  postalAddressId?: number;
  establishNotary?: string;
  notaryName?: string;
  fiscalDate?: Date;
  noSKKemenkumham?: string;
  establishDate?: Date;
  establishPlace?: string;
  decreeMinstrDate?: Date;
  number?: string;
  value?: string;
  bodTermEndDate?: Date;
  stateGazetteDate?: Date;
  stateGazetteNumber?: string;
  decreeOfMinister?: string;
  korean?: string;
  lastAmend?: string;
  pic?: string;
  mainCorpName?: string;
  identityNumber?: string;
  koreanIdNumber?: string;
  mainCorpCountry?: string;
  identityTypeId?: string;
  endOfDate?: string;
  businessTypeId?: string;
  lineOfBusinessId?: string;
  otherName?: string;
  pepId?: string;
  deedOfEstablishNo?: string;
  riskProfileId?: string;
  lastAmendDeedOfEstablishNo?: string;
  lastAmendDeedOfEstablishNotaryName?: string;
  decreeDate?: string;
  corpOprDivId?: string;
  attributes?: object;
  companyType?: string;
  customerName?: string;
  relationWithHana?: string;
  siupNumber?: string;
  custInfoSystemName?: string;
  customerSince?: string;
  abbreviation?: string;
  gnrlBankReport?: string;
  collectabilityStatus?: string;
  CreditRating?: string;
  callReportCategory?: string;
  purposeId?: string;
  depositCapital?: string;
  umkmCategory?: string;
  umkmClassification?: string;
  custInfoSystemCode?: string;
  annualSales?: string;
}

export class PartyGroup implements IPartyGroup {
  constructor(
    public id?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public name?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public partyTypeId?: string,
    public partyTypeDescription?: string,
    public groupName?: string,
    public prefix?: string,
    public afiks?: string,
    public officePhone?: string,
    public otherPhone?: string,
    public officeMail?: string,
    public faxOffice?: string,
    public postalAddressId?: number,
    public taxIdNumber?: string,
    public establishNotary?: string,
    public fiscalDate?: Date,
    public establishDate?: Date,
    public establishPlace?: string,
    public decreeMinstrDate?: Date,
    public number?: string,
    public value?: string,
    public notaryName?: string,
    public stateGazetteNumber?: string,
    public bodTermEndDate?: Date,
    public stateGazetteDate?: Date,
    public decreeOfMinister?: string,
    public korean?: string,
    public npwp?: string,
    public identityNumber?: string,
    public pic?: string,
    public noSKKemenkumham?: string,
    public decreeDate?: string,
    public koreanIdNumber?: string,
    public lastAmend?: string,
    public mainCorpName?: string,
    public corpOprDivId?: string,
    public identityTypeId?: string,
    public endOfDate?: string,
    public businessTypeId?: string,
    public otherName?: string,
    public lineOfBusinessId?: string,
    public riskProfileId?: string,
    public pepId?: string,
    public deedOfEstablishNo?: string,
    public lastAmendDeedOfEstablishNo?: string,
    public lastAmendDeedOfEstablishNotaryName?: string,
    public attributes?: object,
    public companyType?: string,
    public customerName?: string,
    public relationWithHana?: string,
    public siupNumber?: string,
    public custInfoSystemName?: string,
    public customerSince?: string,
    public abbreviation?: string,
    public gnrlBankReport?: string,
    public collectabilityStatus?: string,
    public CreditRating?: string,
    public callReportCategory?: string,
    public purposeId?: string,
    public depositCapital?: string,
    public umkmCategory?: string,
    public umkmClassification?: string,
    public custInfoSystemCode?: string,
    public annualSales?: string
  ) {
    this.establishDate = new Date();
  }
}

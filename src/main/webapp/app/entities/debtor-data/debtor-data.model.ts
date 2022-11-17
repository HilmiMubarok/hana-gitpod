export interface IDebtorData {
  id?: number;
  partyId?: string;
  regional?: string;
  segmentBusiness?: string;
  openingBranch?: string;
  rmBranch?: string;
  riskProfile?: string;
  tinSsnEin?: string;
  pep?: string;
  ownerCitizen?: boolean;
  ownerCompany?: boolean;
  useDomicileAddress?: boolean;
  separateAssetAggrement?: boolean;
  businessType?: string;
  groupCompanyId?: number;
  groupCompanyName?: string;
  bookingBranch?: string;
  collectabilityStatus?: string;
  relationWithHana?: string;
  custInfoSystemName?: string;
  custInfoSystemCode?: string;
  gnrlBankReportCode?: string;
  gnrlBankReport?: string;
  depositCapital?: number;
  annualSales?: number;
  umkmCategory?: string;
  umkmClassification?: string;
  creditScoring?: string;
  ifcRiskCategory?: string;
  callReportCategory?: string;
  attributes?: object;
  jsons?: object;
  customerName?: string;
  customerCIF?: string;
  corporateDeedOfEstablishmentNumber?: string;
  corporateDeedOfEstablishmentPlace?: string;
  corporateEstablishDate?: Date;
  corporateDeedOfEstablishNota?: string;
  customerSince?: Date;
  debtorSince?: Date;
  identityType?: string;
  identityNumber?: string;
  personInCharge?: string;
  businessPermitNumber?: string;
  accountNumberUSD?: number;
  accountNumberIDR?: number;
  correspondenceAddress?: string;
  occupiedSince?: Date;
}

export class DebtorData implements IDebtorData {
  constructor(
    public id?: number,
    public partyId?: string,
    public regional?: string,
    public segmentBusiness?: string,
    public openingBranch?: string,
    public rmBranch?: string,
    public riskProfile?: string,
    public tinSsnEin?: string,
    public pep?: string,
    public ownerCitizen?: boolean,
    public ownerCompany?: boolean,
    public useDomicileAddress?: boolean,
    public separateAssetAggrement?: boolean,
    public businessType?: string,
    public groupCompanyId?: number,
    public groupCompanyName?: string,
    public bookingBranch?: string,
    public collectabilityStatus?: string,
    public relationWithHana?: string,
    public custInfoSystemName?: string,
    public custInfoSystemCode?: string,
    public gnrlBankReportCode?: string,
    public gnrlBankReport?: string,
    public depositCapital?: number,
    public annualSales?: number,
    public umkmCategory?: string,
    public umkmClassification?: string,
    public ifcRiskCategory?: string,
    public callReportCategory?: string,
    public attributes?: object,
    public jsons?: object,
    public customerName?: string,
    public customerCIF?: string,
    public corporateDeedOfEstablishmentNumber?: string,
    public corporateDeedOfEstablishmentPlace?: string,
    public corporateEstablishDate?: Date,
    public corporateDeedOfEstablishNota?: string,
    public customerSince?: Date,
    public debtorSince?: Date,
    public identityType?: string,
    public identityNumber?: string,
    public personInCharge?: string,
    public businessPermitNumber?: string,
    public accountNumberIDR?: number,
    public accountNumberUSD?: number,
    public correspondenceAddress?: string,
    public occupiedSince?: Date
  ) {
    this.ownerCitizen = false;
    this.ownerCompany = false;
    this.useDomicileAddress = false;
    this.separateAssetAggrement = false;
    this.attributes = {};
    this.jsons = {};
  }
}

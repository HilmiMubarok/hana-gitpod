import { IParty } from '../party/party.model';

export interface IPerson extends IParty {
  idParty?: string;
  firstName?: string;
  middleName?: string;
  aliasName?: string;
  lastName?: string;
  pob?: string;
  dob?: Date;
  prefix?: string;
  afiks?: string;
  bloodType?: string;
  gender?: string;
  citizenship?: string;
  maritalStatus?: string;
  idThruDate?: Date;
  otherIdentity?: string;
  otheridNumber?: string;
  otherIdDate?: Date;
  korean?: string;
  koreanIdNum?: string;
  riskProfile?: string;
  tinSsnEin?: string;
  accountNum?: bigint;
  personalIdNumber?: string;
  familyIdNumber?: string;
  taxIdNumber?: string;
  cellPhone1?: string;
  cellPhone2?: string;
  cellPhone3?: string;
  identificationTypeId?: string;
  thruDate?: string;
  relationWithHana?: string;
  lineOfBusiness?: string;
  custInfoSystemCode?: string;
  custInfoSystemName?: string;
  gnrlBankReportCode?: string;
  gnrlBankReport?: string;
  collectabilityStatus?: string;
  callReportCategory?: string;
  age?: string;
  createdDate?: string;
  abbreviation?: string;
  depositCapital?: string;
  annualSales?: string;
  creditRating?: string;
  ifcRiskCategory?: string;
  homePhone?: string;
  personalEmail?: string;
  mothersName?: string;
  notes?: string;
  userLogin?: string;
  religionTypeDescription?: string;
  religionTypeId?: string;
  workTypeDescription?: string;
  workTypeId?: string;
  attributes?: object;
  permitLogin?: boolean;
  password?: string;
}

export class Person implements IPerson {
  parentId: any;
  constructor(
    public idParty?: string,
    public id?: string,
    public firstName?: string,
    public middleName?: string,
    public lastName?: string,
    public pob?: string,
    public dob?: Date,
    public prefix?: string,
    public afiks?: string,
    public bloodType?: string,
    public gender?: string,
    public citizenship?: string,
    public maritalStatus?: string,
    public idThruDate?: Date,
    public otherIdentity?: string,
    public otheridNumber?: string,
    public otherIdDate?: Date,
    public korean?: string,
    public koreanIdNum?: string,
    public riskProfile?: string,
    public tinSsnEin?: string,
    public accountNum?: bigint,
    public personalIdNumber?: string,
    public familyIdNumber?: string,
    public taxIdNumber?: string,
    public cellPhone1?: string,
    public cellPhone2?: string,
    public homePhone?: string,
    public personalEmail?: string,
    public mothersName?: string,
    public notes?: string,
    public userLogin?: string,
    public religionTypeDescription?: string,
    public religionTypeId?: string,
    public workTypeDescription?: string,
    public workTypeId?: string,
    public aliasName?: string,
    public attributes?: object,
    public permitLogin?: boolean,
    public password?: string,
    public identificationTypeId?: string,
    public thruDate?: string,
    public relationWithHana?: string,
    public lineOfBusiness?: string,
    public custInfoSystemCode?: string,
    public custInfoSystemName?: string,
    public gnrlBankReportCode?: string,
    public gnrlBankReport?: string,
    public collectabilityStatus?: string,
    public callReportCategory?: string,
    public age?: string,
    public createdDate?: string,
    public abbreviation?: string,
    public depositCapital?: string,
    public annualSales?: string,
    public creditRating?: string,
    public ifcRiskCategory?: string
  ) {
    this.dob = new Date();
    this.attributes = {};
  }
}

import { IParty } from '../party/party.model';

export interface IPerson extends IParty {
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
  personalIdType?: string;
  familyIdNumber?: string;
  taxIdNumber?: string;
  cellPhone1?: string;
  cellPhone2?: string;
  cellPhone3?: string;
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
  name?: string;
  accountNumberIDR?: string;
  accountNumberUSD?: string;
}

export class Person implements IPerson {
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
    public personalIdType?: string,
    public familyIdNumber?: string,
    public taxIdNumber?: string,
    public cellPhone1?: string,
    public cellPhone2?: string,
    public cellPhone3?: string,
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
    public name?: string,
    public accountNumberIDR?: string,
    public accountNumberUSD?: string
  ) {
    this.dob = new Date();
    this.gender = null;
    this.attributes = {};
  }
}

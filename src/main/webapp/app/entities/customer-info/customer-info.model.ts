export interface ICustomerInfo {
  id?: number;
  attributes?: any;
  idParty?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  pob?: string;
  dob?: string;
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
  homePhone?: string;
  personalEmail?: string;
  mothersName?: string;
  notes?: string;
  userLogin?: string;
  religionTypeDescription?: string;
  religionTypeId?: string;
  workTypeDescription?: string;
  workTypeId?: string;
}

export class CustomerInfo implements ICustomerInfo {
  constructor(
    public id?: number,
    public attributes?: any,
    public idParty?: string,
    public firstName?: string,
    public middleName?: string,
    public lastName?: string,
    public pob?: string,
    public dob?: string,
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
    public workTypeId?: string
  ) {}
}

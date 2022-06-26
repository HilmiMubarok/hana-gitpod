import { IParty } from '../party/party.model';

export interface IPerson extends IParty {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  pob?: string;
  dob?: Date;
  bloodType?: string;
  gender?: string;
  citizenship?: string;
  maritalStatus?: string;
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

export class Person implements IPerson {
  constructor(
    public id?: string,
    public firstName?: string,
    public lastName?: string,
    public pob?: string,
    public dob?: Date,
    public bloodType?: string,
    public gender?: string,
    public citizenship?: string,
    public maritalStatus?: string,
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
    public partyTypeDescription?: string,
    public partyTypeId?: string,
    public religionTypeDescription?: string,
    public religionTypeId?: string,
    public workTypeDescription?: string,
    public workTypeId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}

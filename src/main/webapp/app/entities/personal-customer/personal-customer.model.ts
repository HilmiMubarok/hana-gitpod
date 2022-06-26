import { IPartyRole } from 'app/entities/party-role/party-role.model';
import { IPartyClassification } from 'app/entities/party-classification/party-classification.model';
import { IPostalAddress } from '../postal-address/postal-address.model';
import { IRoleCustomer } from '../role-customer/role-customer.model';

export interface IPersonalCustomer {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  pob?: string;
  dob?: Date;
  bloodType?: string;
  gender?: string;
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
  partyTypeDescription?: string;
  partyTypeId?: string;
  roles?: IPartyRole[];
  classifications?: IPartyClassification[];
  religionTypeDescription?: string;
  religionTypeId?: string;
  workTypeDescription?: string;
  workTypeId?: string;
  postalAddress?: IPostalAddress;
  role?: IRoleCustomer;
}

export class PersonalCustomer implements IPersonalCustomer {
  constructor(
    public id?: string,
    public name?: string,
    public firstName?: string,
    public lastName?: string,
    public pob?: string,
    public dob?: Date,
    public bloodType?: string,
    public gender?: string,
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
    public roles?: IPartyRole[],
    public classifications?: IPartyClassification[],
    public religionTypeDescription?: string,
    public religionTypeId?: string,
    public workTypeDescription?: string,
    public workTypeId?: string,
    public postalAddress?: IPostalAddress,
    public role?: IRoleCustomer
  ) {}
}

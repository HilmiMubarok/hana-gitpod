import { IPartyRole } from '../party-role/party-role.model';
import { IPerson, Person } from '../person/person.model';

export interface IEmployee extends IPartyRole {
  employeeCode?: string;
  registrationDate?: Date;
  fromDate?: Date;
  thruDate?: Date;
  roleDescription?: string;
  roleId?: string;
  person?: IPerson;
  internalName?: string;
  internalId?: string;
  employmentTypeDescription?: string;
  employmentTypeId?: string;
  name?: string;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public employeeCode?: string,
    public registrationDate?: Date,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleDescription?: string,
    public roleId?: string,
    public person?: IPerson,
    public internalName?: string,
    public internalId?: string,
    public employmentTypeDescription?: string,
    public employmentTypeId?: string,
    public name?: string,
    public partyId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any
  ) {
    this.person = new Person();
  }
}

export interface IEmployeeDownload {
  id?: number;
  partyId?: string;
  internalId?: string;
  userLogin?: string;
  personalEmail?: string;
  statusId?: string;
  firstName?: string;
  lastName?: string;
  employeeCode?: string;
}

export class EmployeeDownload implements IEmployeeDownload {
  constructor(
    public id?: number,
    public partyId?: string,
    public internalId?: string,
    public userLogin?: string,
    public personalEmail?: string,
    public statusId?: string,
    public firstName?: string,
    public lastName?: string,
    public employeeCode?: string
  ) {}
}

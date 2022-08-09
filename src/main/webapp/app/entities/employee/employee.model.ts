import { IPerson, Person } from '../person/person.model';

export interface IEmployee {
  id?: number;
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
    public employmentTypeId?: string
  ) {
    this.person = new Person();
  }
}

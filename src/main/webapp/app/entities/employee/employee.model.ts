import { IPerson, Person } from '../person/person.model';
import { IPosition, Position } from '../position/position.model';

export interface IEmployee {
  id?: number;
  employeeCode?: string;
  registrationDate?: Date;
  fromDate?: Date;
  thruDate?: Date;
  roleDescription?: string;
  roleId?: string;
  positions?: IPosition[];
  person?: IPerson;
  personName?: string;
  personId?: string;
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
    public positions?: Position[],
    public person?: Person,
    public personName?: string,
    public personId?: string,
    public internalName?: string,
    public internalId?: string,
    public employmentTypeDescription?: string,
    public employmentTypeId?: string
  ) {
    this.positions = new Array<IPosition>();
  }
}

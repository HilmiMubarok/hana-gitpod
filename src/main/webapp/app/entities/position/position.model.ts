export interface IPosition {
  id?: number;
  sequence?: number;
  name?: string;
  description?: string;
  positionTypeDescription?: string;
  positionTypeId?: string;
  employeeName?: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  employeeCode?: string;
  employeeEmail?: string;
  employeeId?: number;
  partyId?: string;
  personId?: string;
  internalName?: string;
  internalId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class Position implements IPosition {
  constructor(
    public id?: number,
    public sequence?: number,
    public name?: string,
    public description?: string,
    public positionTypeDescription?: string,
    public positionTypeId?: string,
    public employeeName?: string,
    public employeeFirstName?: string,
    public employeeLastName?: string,
    public employeeId?: number,
    public internalName?: string,
    public internalId?: string,
    public partyId?: string,
    public personId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}

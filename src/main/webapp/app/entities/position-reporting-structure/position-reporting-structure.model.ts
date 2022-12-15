export interface IPositionReportingStructure {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  relationTypeId?: string;
  positionFromDescription?: string;
  positionFromId?: number;
  positionFromEmployeeName?: string;
  positionFromInternalId?: string;
  positionTypeFromDescription?: string;
  positionToDescription?: string;
  positionToId?: number;
  positionToEmployeeName?: string;
  positionToInternalId?: string;
  positionTypeToDescription?: string;
  positionDelegationToId?: number;
  positionDelegationToCode?: string;
  positionDelegationToDescription?: string;
  positionDelegationToEmployeeName?: string;
  positionDelegationToInternalId?: string;
  positionTypeDelegationToDescription?: string;
}

export class PositionReportingStructure implements IPositionReportingStructure {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public relationTypeId?: string,
    public positionFromDescription?: string,
    public positionFromId?: number,
    public positionFromInternalId?: string,
    public positionTypeFromDescription?: string,
    public positionToDescription?: string,
    public positionToId?: number,
    public positionToInternalId?: string,
    public positionTypeToDescription?: string,
    public positionDelegationToId?: number,
    public positionDelegationToCode?: string,
    public positionDelegationToDescription?: string,
    public positionFromEmployeeName?: string,
    public positionToEmployeeName?: string,
    public positionDelegationToEmployeeName?: string,
    public positionDelegationToInternalId?: string,
    public positionTypeDelegationToDescription?: string
  ) {}
}

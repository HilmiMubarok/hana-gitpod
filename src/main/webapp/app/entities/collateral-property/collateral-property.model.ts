import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';

export interface ICollateralProperty {
  id?: number;
  propertyType?: CollateralPropertyType;
  description?: string;
  partyId?: string;
  collateralId?: number;
  appraisalId?: number;
  collPropertyType?: string;
  buildingFac?: string;
  buildingSpec?: string;
  floorNo?: number;
  buildingAreaTtl?: number;
  construction?: string;
  foundation?: string;
  wall?: string;
  flooring?: string;
  ceiling?: string;
  roofTruss?: string;
  roof?: string;
  imb?: string;
  imbDate?: Date;
  storeyTtl?: string;
  imbArea?: number;
  certificateNumber?: string;
  owner?: string;
  dateOfIssue?: Date;
  dueDate?: Date;
  surveyCertificateNumber?: string;
  machineName?: string;
  machineDocType?: string;
  machineDocNum?: string;
  machineDate?: Date;
  machineDateFrom?: Date;
  machineAmount?: string;
  machineMerk?: string;
  machineMadeBy?: string;
  machineYear?: number;
  machineModelType?: string;
  machineType?: string;
  machineMfgDate?: Date;
  machineSpec?: string;
  machineCondition?: string;
  machineNotes?: string;
  bpkbNum?: string;
  bpkbName?: string;
  vehNum?: string;
  vehYear?: number;
  stnkNum?: string;
  chassisNum?: string;
  vehMachineNum?: string;
  vehInvNum?: string;
  vehUsedBy?: string;
  vehBrand?: string;
  vehType?: string;
  vehCategory?: string;
  vehModel?: string;
  vehCylinder?: string;
  vehColour?: string;
  vehFuel?: string;
  vehtransmission?: string;
  vehWheelsTtl?: string;
  vehUnitCond?: string;
  vehNotes?: string;
  attributes?: any;
}

export class CollateralProperty implements ICollateralProperty {
  constructor(
    public id?: number,
    public propertyType?: CollateralPropertyType,
    public description?: string,
    public partyId?: string,
    public collateralId?: number,
    public appraisalId?: number,
    public collPropertyType?: string,
    public buildingFac?: string,
    public buildingSpec?: string,
    public floorNo?: number,
    public buildingAreaTtl?: number,
    public construction?: string,
    public foundation?: string,
    public wall?: string,
    public flooring?: string,
    public ceiling?: string,
    public roofTruss?: string,
    public roof?: string,
    public imb?: string,
    public imbDate?: Date,
    public storeyTtl?: string,
    public imbArea?: number,
    public certificateNumber?: string,
    public owner?: string,
    public dateOfIssue?: Date,
    public dueDate?: Date,
    public surveyCertificateNumber?: string,
    public machineName?: string,
    public machineDocType?: string,
    public machineDocNum?: string,
    public machineDate?: Date,
    public machineDateFrom?: Date,
    public machineAmount?: string,
    public machineMerk?: string,
    public machineMadeBy?: string,
    public machineYear?: number,
    public machineModelType?: string,
    public machineType?: string,
    public machineMfgDate?: Date,
    public machineSpec?: string,
    public machineCondition?: string,
    public machineNotes?: string,
    public bpkbNum?: string,
    public bpkbName?: string,
    public vehNum?: string,
    public vehYear?: number,
    public stnkNum?: string,
    public chassisNum?: string,
    public vehMachineNum?: string,
    public vehInvNum?: string,
    public vehUsedBy?: string,
    public vehBrand?: string,
    public vehType?: string,
    public vehCategory?: string,
    public vehModel?: string,
    public vehCylinder?: string,
    public vehColour?: string,
    public vehFuel?: string,
    public vehtransmission?: string,
    public vehWheelsTtl?: string,
    public vehUnitCond?: string,
    public vehNotes?: string,
    public attributes?: any
  ) {}
}

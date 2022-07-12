export interface IEmployment {
  id?: number;
  companyAddress?: string;
  dati?: string;
  postalCode?: number;
  officephone?: string;
  faxOffice?: string;
  lineOfBusiness?: string;
  detailLineOfbusiness?: string;
  position?: string;
  lengtOfWork?: number;
  slryYear?: number;
  assumptionTran?: number;
  highNormTransCash?: number;
  nonCash?: number;
  grossIncome?: number;
  sourceOfIncome?: string;
  addSourceOfIncome?: string;
  purpsSourceOfIncome?: string;
  cntctPrsnName?: string;
  cntctPrsnPhoneNo?: string;
  fromDate?: Date;
  thruDate?: Date;
  relationTypeDescription?: string;
  relationTypeId?: string;
  partyToName?: string;
  partyToId?: string;
  partyFromName?: string;
  partyFromId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class Employment implements IEmployment {
  constructor(
    public id?: number,
    public companyName?: string,
    public companyAddress?: string,
    public dati?: string,
    public postalCode?: number,
    public officephone?: string,
    public faxOffice?: string,
    public lineOfBusiness?: string,
    public detailLineOfbusiness?: string,
    public position?: string,
    public lengtOfWork?: number,
    public slryYear?: number,
    public assumptionTran?: number,
    public highNormTransCash?: number,
    public nonCash?: number,
    public grossIncome?: number,
    public sourceOfIncome?: string,
    public addSourceOfIncome?: string,
    public purpsSourceOfIncome?: string,
    public cntctPrsnName?: string,
    public cntctPrsnPhoneNo?: string,

    public fromDate?: Date,
    public thruDate?: Date,
    public relationTypeDescription?: string,
    public relationTypeId?: string,
    public partyToName?: string,
    public partyToId?: string,
    public partyFromName?: string,
    public partyFromId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}

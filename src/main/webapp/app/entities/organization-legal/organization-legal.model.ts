export interface IOrganizationLegal {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationName?: string;
  organizationId?: string;
  description?: string;
  legalNumber?: string;
  deedEstablishNum?: string;
  deedEstablishDate?: Date;
  establishNotary?: string;
  establishPlace?: string;
  bodTermEndDate?: Date;
  fiscalDate?: Date;
  decreeMinstrNum?: string;
  decreeMinstrDate?: Date;
  stateGazetteDate?: Date;
  mainCoorpName?: string;
  coorpOprDiv?: string;
  mainCoorpCountry?: string;
  highNormTranscash?: string;
  siupNumber?: string;
}

export class OrganizationLegal implements IOrganizationLegal {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationName?: string,
    public organizationId?: string,
    public description?: string,
    public legalNumber?: string,
    public deedEstablishNum?: string,
    public deedEstablishDate?: Date,
    public establishNotary?: string,
    public establishPlace?: string,
    public bodTermEndDate?: Date,
    public fiscalDate?: Date,
    public decreeMinstrNum?: string,
    public decreeMinstrDate?: Date,
    public stateGazetteDate?: Date,
    public mainCoorpName?: string,
    public coorpOprDiv?: string,
    public mainCoorpCountry?: string,
    public highNormTranscash?: string,
    public siupNumber?: string
  ) {
    this.deedEstablishDate = new Date();
  }
}

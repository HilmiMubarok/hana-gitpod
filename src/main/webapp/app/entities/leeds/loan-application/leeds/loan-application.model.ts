export interface ILoanApplication {
  id?: number;
  applicationNumber?: string;
  description?: string;
  tenor?: number;
  baseLoan?: number;
  installment?: number;
  interest?: number;
  applicationTypeDescription?: string;
  applicationTypeId?: string;
  internalName?: string;
  internalId?: string;
  creditFacilityName?: string;
  creditFacilityId?: number;
  prospectPersonName?: string;
  prospectPersonId?: string;
  prospectOrganizationName?: string;
  prospectOrganizationId?: string;
  partyTypeId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
  notes?: any[];
}

export class LoanApplication implements ILoanApplication {
  constructor(
    public id?: number,
    public applicationNumber?: string,
    public description?: string,
    public tenor?: number,
    public baseLoan?: number,
    public installment?: number,
    public interest?: number,
    public applicationTypeDescription?: string,
    public applicationTypeId?: string,
    public internalName?: string,
    public internalId?: string,
    public creditFacilityName?: string,
    public creditFacilityId?: number,
    public prospectPersonName?: string,
    public prospectPersonId?: string,
    public prospectOrganizationName?: string,
    public prospectOrganizationId?: string,
    public partyTypeId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any,
    public notes?: any[]
  ) {}
}

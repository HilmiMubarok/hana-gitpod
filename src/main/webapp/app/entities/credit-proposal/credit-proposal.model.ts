import { ICommEvent } from "../comm-event/comm-event.model";
import { IOrganizationFinancial } from "../organization-financial/organization-financial.model";
import { IOrganizationLegal } from "../organization-legal/organization-legal.model";
import { IOrganizationManagement } from "../organization-management/organization-management.model";
import { IPartyGroup } from "../party-group/party-group.model";
import { IPartyIdentification } from "../party-identification/party-identification.model";
import { IPerson } from "../person/person.model";

export interface ICreditProposal {
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
  financialProductName?: string;
  financialProductId?: number;
  prospectName?: string;
  prospectId?: string;
  spouseName?: string;
  spouseId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
  notes?: any[];
  personProspect?: IPerson;
  spouse?: IPerson;
  organizationProspect?: IPartyGroup;
  contact?: IPerson;
  commEvents?: ICommEvent[];
  identifications?: IPartyIdentification[];
  financial?: IOrganizationFinancial;
  legal?: IOrganizationLegal;
  managements?: IOrganizationManagement[];
}

export class CreditProposal implements ICreditProposal {
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
    public financialProductName?: string,
    public financialProductId?: number,
    public prospectName?: string,
    public prospectId?: string,
    public spouseName?: string,
    public spouseId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any,
    public notes?: any[],
    public personProspect?: IPerson,
    public spouse?: IPerson,
    public organizationProspect?: IPartyGroup,
    public contact?: IPerson,
    public commEvents?: ICommEvent[],
    public identifications?: IPartyIdentification[],
    public financial?: IOrganizationFinancial,
    public legal?: IOrganizationLegal,
    public managements?: IOrganizationManagement[],
  ) {}
}

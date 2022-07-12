import { IAuditTrail } from 'app/shared/base/audit-trail.model';
import { EntityRole } from 'app/shared/model/entity-role.model';
import { Cif, ICif } from '../cif/cif.model';
import { CommEvent, ICommEvent } from '../comm-event/comm-event.model';
import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial/organization-financial.model';
import { IOrganizationLegal, OrganizationLegal } from '../organization-legal/organization-legal.model';
import { IOrganizationManagement, OrganizationManagement } from '../organization-management/organization-management.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { IPartyIdentification, PartyIdentification } from '../party-identification/party-identification.model';
import { IPerson, Person } from '../person/person.model';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';

export interface ICreditApplication extends IAuditTrail {
  id?: number;
  cif?: ICif;
  tenor?: Number;
  applicationNumber?: String;
  description?: String;
  statusId?: String;
  statusCode?: String;
  statusDescription?: String;
  applicationTypeId?: String;
  applicationTypeDescription?: String;
  internalId?: String;
  internalName?: String;
  roles?: EntityRole[];
  baseLoan?: Number;
  installment?: Number;
  interest?: Number;
  creditFacilityId?: Number;
  creditFacilityName?: String;
  partyTypeId?: String;
  prospectPerson?: IPerson;
  prospectOrganization?: IPartyGroup;
  contact?: IPerson;
  addresses?: IPostalAddress[];
  commEvents?: ICommEvent[];
  identifications?: IPartyIdentification[];
  financial?: IOrganizationFinancial;
  legal?: IOrganizationLegal;
  managements?: IOrganizationManagement[];
  spouse?: IPerson;
}

export class CreditApplication implements ICreditApplication {
  constructor(
    public id?: number,
    public cif?: Cif,
    public tenor?: Number,
    public applicationNumber?: String,
    public description?: String,
    public statusId?: String,
    public statusCode?: String,
    public statusDescription?: String,
    public applicationTypeId?: String,
    public applicationTypeDescription?: String,
    public internalId?: String,
    public internalName?: String,
    public commEvents?: CommEvent[],
    public identifications?: PartyIdentification[],
    public financial?: OrganizationFinancial,
    public legal?: OrganizationLegal,
    public managements?: OrganizationManagement[],
    public createdDate?: Date,
    public createdBy?: Date,
    public lastModifiedBy?: String,
    public lastModifiedDate?: Date,
    public creditFacilityId?: Number,
    public creditFacilityName?: String,
    public partyTypeId?: String,
    public prospectPerson?: Person,
    public prospectOrganization?: PartyGroup,
    public contact?: Person,
    public addresses?: PostalAddress[],
    public spouse?: Person
  ) {
    this.cif = new Cif();
    this.commEvents = new Array<CommEvent>();
    this.identifications = new Array<PartyIdentification>();
    this.legal = new OrganizationLegal();
    this.managements = new Array<OrganizationManagement>();
    this.addresses = new Array<PostalAddress>();
    this.spouse = new Person();
    this.contact = new Person();
    this.prospectOrganization = new PartyGroup();
    this.prospectPerson = new Person();
    this.financial = new OrganizationFinancial();
  }
}

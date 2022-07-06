import { Cif, ICif } from '../cif/cif.model';
import { CommEvent, ICommEvent } from '../comm-event/comm-event.model';
import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial/organization-financial.model';
import { IOrganizationLegal, OrganizationLegal } from '../organization-legal/organization-legal.model';
import { IOrganizationManagement, OrganizationManagement } from '../organization-management/organization-management.model';
import { IPartyIdentification, PartyIdentification } from '../party-identification/party-identification.model';

export interface ICreditApplication {
  id?: number;
  cif?: ICif;
  commEvents?: ICommEvent[];
  identifications?: IPartyIdentification[];
  financial?: IOrganizationFinancial;
  legal?: IOrganizationLegal;
  managements?: IOrganizationManagement;
}

export class CreditApplication implements ICreditApplication {
  constructor(
    public id?: number,
    public cif?: Cif,
    public commEvents?: CommEvent[],
    public identifications?: PartyIdentification[],
    public financial?: OrganizationFinancial,
    public legal?: OrganizationLegal,
    public managements?: OrganizationManagement
  ) {
    this.cif = new Cif();
    this.commEvents = new Array<CommEvent>();
    this.identifications = new Array<PartyIdentification>();
    this.legal = new OrganizationLegal();
    this.managements = new OrganizationManagement();
  }
}

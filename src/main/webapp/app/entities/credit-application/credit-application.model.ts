import { Cif, ICif } from '../cif/cif.model';
import { CommEvent, ICommEvent } from '../comm-event/comm-event.model';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import { ILoanApplication } from '../loan-application/loan-application.model';
import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial/organization-financial.model';
import { IOrganizationLegal, OrganizationLegal } from '../organization-legal/organization-legal.model';
import { IOrganizationManagement, OrganizationManagement } from '../organization-management/organization-management.model';
import { IPartyGroup } from '../party-group/party-group.model';
import { IPartyIdentification, PartyIdentification } from '../party-identification/party-identification.model';
import { IPartyPaymentPref } from '../party-payment-pref/party-payment-pref.model';
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { IPerson } from '../person/person.model';

export interface ICreditApplication extends ILoanApplication {
  cif?: ICif;
  commEvents?: ICommEvent[];
  identifications?: IPartyIdentification[];
  financial?: IOrganizationFinancial;
  legal?: IOrganizationLegal;
  managements?: IOrganizationManagement[];
  personProspect?: IPerson;
  organizationProspect?: IPartyGroup;
  contact?: IPerson;
  addresses?: IPartyPostalAddress[];
  debtorData?: IDebtorData;
  paymentPrefs?: IPartyPaymentPref[];
}

export class CreditApplication implements ICreditApplication {
  constructor(
    public id?: number,
    public cif?: Cif,
    public commEvents?: CommEvent[],
    public identifications?: PartyIdentification[],
    public financial?: OrganizationFinancial,
    public legal?: OrganizationLegal,
    public managements?: OrganizationManagement[]
  ) {
    this.cif = new Cif();
    this.commEvents = new Array<CommEvent>();
    this.identifications = new Array<PartyIdentification>();
    this.legal = new OrganizationLegal();
    this.managements = new Array<OrganizationManagement>();
  }
}

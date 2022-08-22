import { ICustomer } from '../customer/customer.model';
import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { IPartyIdentification } from '../party-identification/party-identification.model';
import { IPartyPaymentPref } from '../party-payment-pref/party-payment-pref.model';
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { IFinServiceAccount } from '../fin-service-account/fin-service-account.model';

export interface ICif extends ICustomer {
  number?: string;
  customerStatus?: string;
  regional?: string;
  segmentBusiness?: string;
  openingBranch?: string;
  riskProfile?: string;
  tinSsnEin?: string;
  accounts?: IFinServiceAccount[];
}

export class Cif implements ICif {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public partyId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any,
    public customerId?: string,
    public name?: string,
    public internalId?: string,
    public customerType?: CustomerType,
    public identifications?: IPartyIdentification[],
    public paymentPrefs?: IPartyPaymentPref[],
    public addresses?: IPartyPostalAddress[],
    public number?: string,
    public customerStatus?: string,
    public regional?: string,
    public segmentBusiness?: string,
    public openingBranch?: string,
    public riskProfile?: string,
    public tinSsnEin?: string,
    public accounts?: IFinServiceAccount[]
  ) {
    this.addresses = new Array<IPartyPostalAddress>();
    this.identifications = new Array<IPartyIdentification>();
    this.paymentPrefs = new Array<IPartyPaymentPref>();
    this.accounts = new Array<IFinServiceAccount>();
  }
}

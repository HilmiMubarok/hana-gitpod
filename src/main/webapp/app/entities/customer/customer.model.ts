import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { IPartyIdentification } from '../party-identification/party-identification.model';
import { IPartyPaymentPref } from '../party-payment-pref/party-payment-pref.model';
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { IPartyRole } from '../party-role/party-role.model';
import { IPerson } from '../person/person.model';

export interface ICustomer extends IPartyRole {
  customerId?: string;
  name?: string;
  internalId?: string;
  customerType?: CustomerType;
  identifications?: IPartyIdentification[];
  paymentPrefs?: IPartyPaymentPref[];
  addresses?: IPartyPostalAddress[];
  rm?: IPerson;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
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
    public rm?: IPerson
  ) {
    this.identifications = new Array<IPartyIdentification>();
    this.paymentPrefs = new Array<IPartyPaymentPref>();
    this.addresses = new Array<IPartyPostalAddress>();
  }
}

import * as uuid from 'uuid';
export interface ITradeCheckingSupplier {
  id?: number;
  // buyersName?: string;
  suppliersName?: string;
  termsOfPayment?: string;
  relationshipSince?: string;
  purchase?: string;
  reflection?: string;
  contact?: string;
  explanation?: string;
}

export class TradeCheckingSupplier {
  constructor(
    public id?: number,
    // public buyersName?: string,
    public suppliersName?: string,
    public termsOfPayment?: string,
    public relationshipSince?: string,
    public purchase?: string,
    public reflection?: string,
    public contact?: string,
    public explanation?: string
  ) {
    this.id = uuid.v4();
    this.suppliersName = '';
    this.termsOfPayment = '';
    this.relationshipSince = '';
    this.reflection = '';
    this.contact = '';
    this.explanation = '';
  }
}

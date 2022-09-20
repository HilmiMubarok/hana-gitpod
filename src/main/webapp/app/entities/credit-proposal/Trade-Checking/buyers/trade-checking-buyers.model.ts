import * as uuid from 'uuid';
export interface ITradeCheckingBuyers {
  id?: number;
  // buyersName?: string;
  buyersName?: string;
  termsOfPayment?: string;
  relationshipSince?: string;
  purchase?: string;
  reflection?: string;
  contact?: string;
  explanation?: string;
}

export class TradeCheckingBuyers {
  constructor(
    public id?: number,
    // public buyersName?: string,
    public buyersName?: string,
    public termsOfPayment?: string,
    public relationshipSince?: string,
    public purchase?: string,
    public reflection?: string,
    public contact?: string,
    public explanation?: string
  ) {
    this.id = uuid.v4();
    this.buyersName = '';
    this.termsOfPayment = '';
    this.relationshipSince = '';
    this.reflection = '';
    this.contact = '';
    this.explanation = '';
  }
}

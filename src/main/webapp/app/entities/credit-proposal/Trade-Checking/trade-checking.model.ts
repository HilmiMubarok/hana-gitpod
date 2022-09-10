export interface ITradeChecking {
  buyersName?: string;
  suppliersName?: string;
  termsOfPayment?: string;
  relationshipSince?: string;
  purchase?: string;
  reflection?: string;
  contact?: string;
  explanation?: string;
  termsOfPayment1?: string;
  relationshipSince1?: string;
  purchase1?: string;
  reflection1?: string;
  contact1?: string;
  explanation1?: string;
}

export class TradeChecking implements ITradeChecking {
  constructor(
    public buyersName?: string,
    public suppliersName?: string,
    public termsOfPayment?: string,
    public relationshipSince?: string,
    public purchase?: string,
    public reflection?: string,
    public contact?: string,
    public explanation?: string,
    public termsOfPayment1?: string,
    public relationshipSince1?: string,
    public purchase1?: string,
    public reflection1?: string,
    public contact1?: string,
    public explanation1?: string,
    public grid1?: ITradeChecking[],
    public grid2?: ITradeChecking[]
  ) {
    this.buyersName = '';
    this.suppliersName = '';
    this.contact1 = '';
    this.termsOfPayment = '';
    this.relationshipSince = '';
    this.purchase = '';
    this.reflection = '';
    this.contact = '';
    this.explanation = '';
    this.termsOfPayment1 = '';
    this.relationshipSince1 = '';
    this.purchase1 = '';
    this.reflection1 = '';
    this.contact1 = '';
    this.explanation1 = '';
    (this.grid1 = []), (this.grid2 = []);
  }
}

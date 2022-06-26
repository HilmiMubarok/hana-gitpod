export interface IGoodIdentification {
  id?: number;
  value?: string;
  identificationDescription?: string;
  identificationId?: string;
  productId?: string;
}

export class GoodIdentification implements IGoodIdentification {
  constructor(
    public id?: number,
    public value?: string,
    public identificationDescription?: string,
    public identificationId?: string,
    public productId?: string
  ) {}
}

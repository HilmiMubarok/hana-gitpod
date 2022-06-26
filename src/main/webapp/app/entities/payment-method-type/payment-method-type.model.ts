export interface IPaymentMethodType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  defGLAccountAccountNumber?: string;
  defGLAccountId?: number;
  accountTypeDescription?: string;
  accountTypeId?: string;
}

export class PaymentMethodType implements IPaymentMethodType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public defGLAccountAccountNumber?: string,
    public defGLAccountId?: number,
    public accountTypeDescription?: string,
    public accountTypeId?: string
  ) {}
}

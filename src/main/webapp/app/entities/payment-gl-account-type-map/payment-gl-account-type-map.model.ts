export interface IPaymentGLAccountTypeMap {
  id?: number;
  paymentTypeDescription?: string;
  paymentTypeId?: string;
  glAccountTypeDescription?: string;
  glAccountTypeId?: string;
  organizationName?: string;
  organizationId?: string;
}

export class PaymentGLAccountTypeMap implements IPaymentGLAccountTypeMap {
  constructor(
    public id?: number,
    public paymentTypeDescription?: string,
    public paymentTypeId?: string,
    public glAccountTypeDescription?: string,
    public glAccountTypeId?: string,
    public organizationName?: string,
    public organizationId?: string
  ) {}
}

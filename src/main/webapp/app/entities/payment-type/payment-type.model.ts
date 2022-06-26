import { IPaymentGLAccountTypeMap } from 'app/entities/payment-gl-account-type-map/payment-gl-account-type-map.model';

export interface IPaymentType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  glAccountTypeDescription?: string;
  glAccountTypeId?: number;
  accountTransTypeDescription?: string;
  accountTransTypeId?: string;
  typeMaps?: IPaymentGLAccountTypeMap[];
}

export class PaymentType implements IPaymentType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public glAccountTypeDescription?: string,
    public glAccountTypeId?: number,
    public accountTransTypeDescription?: string,
    public accountTransTypeId?: string,
    public typeMaps?: IPaymentGLAccountTypeMap[]
  ) {}
}

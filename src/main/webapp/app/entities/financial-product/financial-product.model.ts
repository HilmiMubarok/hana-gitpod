import { IFeatureApplicable } from 'app/entities/feature-applicable/feature-applicable.model';

export interface IFinancialProduct {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  introDate?: Date;
  discontinueDate?: Date;
  productTypeDescription?: string;
  productTypeId?: string;
  features?: IFeatureApplicable[];
}

export class FinancialProduct implements IFinancialProduct {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public introDate?: Date,
    public discontinueDate?: Date,
    public productTypeDescription?: string,
    public productTypeId?: string,
    public features?: IFeatureApplicable[]
  ) {}
}

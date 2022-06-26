import { IProductClassification } from 'app/entities/product-classification/product-classification.model';
import { IFeatureApplicable } from 'app/entities/feature-applicable/feature-applicable.model';
import { IGoodIdentification } from 'app/entities/good-identification/good-identification.model';

export interface IProductConfig {
  id?: number;
  expense?: boolean;
  sold?: boolean;
  purchased?: boolean;
  traceAbility?: boolean;
  taxable?: boolean;
  volume?: number;
  weight?: number;
  uomAbbreviation?: string;
  uomId?: string;
  purchaseTaxDescription?: string;
  purchaseTaxId?: string;
  salesTaxDescription?: string;
  salesTaxId?: string;
  classifications?: IProductClassification[];
  featureApplicables?: IFeatureApplicable[];
  identifications?: IGoodIdentification[];
}

export class ProductConfig implements IProductConfig {
  constructor(
    public id?: number,
    public expense?: boolean,
    public sold?: boolean,
    public purchased?: boolean,
    public traceAbility?: boolean,
    public taxable?: boolean,
    public volume?: number,
    public weight?: number,
    public uomAbbreviation?: string,
    public uomId?: string,
    public purchaseTaxDescription?: string,
    public purchaseTaxId?: string,
    public salesTaxDescription?: string,
    public salesTaxId?: string,
    public classifications?: IProductClassification[],
    public featureApplicables?: IFeatureApplicable[],
    public identifications?: IGoodIdentification[]
  ) {
    this.expense = this.expense || false;
    this.sold = this.sold || false;
    this.purchased = this.purchased || false;
    this.traceAbility = this.traceAbility || false;
    this.taxable = this.taxable || false;
  }
}

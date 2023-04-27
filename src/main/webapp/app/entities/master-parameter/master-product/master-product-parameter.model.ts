export interface IMasterProductParameter {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  introDate?: Date;
  discontinueDate?: Date;
  productTypeId?: string;
  productTypeCash?: boolean;
  revolving?: boolean;
}

export class MasterProductParameter implements IMasterProductParameter {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public introDate?: Date,
    public discontinueDate?: Date,
    public productTypeId?: string,
    public productTypeCash?: boolean,
    public revolving?: boolean
  ) {
    this.introDate = new Date();
    this.discontinueDate = new Date();
  }
}

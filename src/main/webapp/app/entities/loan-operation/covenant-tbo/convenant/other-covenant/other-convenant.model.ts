import * as uuid from 'uuid';
export interface IOtherCovenant {
  id?: string;
  covenant?: string;
  categoryId?: string;
  categoryName?: string;
  sub_category?: string;
  status?: string;
  deviation?: string;
  justification?: string;
  otherCovenant?: any;
}

export class OtherCovenant {
  constructor(
    public id?: string,
    public covenant?: string,
    public categoryId?: string,
    public categoryName?: string,
    public sub_category?: string,
    public status?: string,
    public deviation?: string,
    public justification?: string,
    public otherCovenant?: string
  ) {
    this.id = uuid.v4();
    this.covenant = '';
    this.categoryId = '';
    this.categoryName = '';
    this.sub_category = '';
    this.status = '';
    this.deviation = '';
    this.justification = '';
  }
}

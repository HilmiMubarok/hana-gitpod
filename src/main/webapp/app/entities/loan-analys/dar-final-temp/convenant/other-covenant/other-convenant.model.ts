import * as uuid from 'uuid';
export interface IOtherCovenant {
  id?: string;
  covenant?: string;
  status?: string;
  deviation?: string;
  justification?: string;
  otherCovenant?: any;
}

export class OtherCovenant {
  constructor(
    public id?: string,
    public covenant?: string,
    public status?: string,
    public deviation?: string,
    public justification?: string,
    public otherCovenant?: string
  ) {
    this.id = uuid.v4();
    this.covenant = '';
    this.status = '';
    this.deviation = '';
    this.justification = '';
  }
}

export interface IBusinessActivityEntity {
  visitBy?: string;
  visitWith?: string;
  visitDate?: string;
  positionInCompany?: string;
  venue?: string;
  notes?: string;
}

export class BusinessActivity implements IBusinessActivityEntity {
  constructor(
    public visitBy?: string,
    public visitWith?: string,
    public visitDate?: string,
    public positionInCompany?: string,
    public venue?: string,
    public notes?: string
  ) {
    this.visitBy = '';
    this.visitWith = '';
    this.visitDate = '';
    this.positionInCompany = '';
    this.venue = '';
    this.notes = '';
  }
}

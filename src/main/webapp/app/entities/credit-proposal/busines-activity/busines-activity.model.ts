export interface IBusinessActivityEntity {
  visitBy?: string;
  visitWith?: string;
  visitDate?: string;
  positionInCompany?: string;
  venue?: string;
  notes?: string;
  notesPa?: string;
  riskMitigation?: string;
  value?: string;
  parameter?: string;
}

export class BusinessActivity implements IBusinessActivityEntity {
  constructor(
    public visitBy?: string,
    public visitWith?: string,
    public visitDate?: string,
    public positionInCompany?: string,
    public venue?: string,
    public notes?: string,
    public notesPa?: string,
    public riskMitigation?: string,
    public parameter?: string,
    public value?: string,
    public BusinessAct?: IBusinessActivityEntity[]
  ) {
    this.visitBy = '';
    this.visitWith = '';
    this.visitDate = '';
    this.positionInCompany = '';
    this.venue = '';
    this.notes = '';
    this.notesPa = '';
    this.riskMitigation = '';
    this.parameter = '';
    this.value = '';
    this.BusinessAct = [];
  }
}

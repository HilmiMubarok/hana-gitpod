export interface IAssignTo {
  id?: number;
  applicationId?: number;
  partyId?: string;
  partyName?: string;
  roleId?: string;
  roleDescription?: string;
  idPosition?: number;
}
export class DocumentData implements IAssignTo {
  constructor(
    public id?: number,
    public applicationId?: number,
    public partyId?: string,
    public partyName?: string,
    public roleId?: string,
    public roleDescription?: string,
    public idPosition?: number
  ) {
    this.id = 0;
    this.applicationId = 0;
    this.partyId = '';
    this.partyName = '';
    this.roleId = '';
    this.roleDescription = '';
    this.idPosition = 0;
  }
}

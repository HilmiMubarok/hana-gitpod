export interface IMasterComplianceChecklist {
  id?: number;
  regItemNo?: number;
  regulationName?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}
export class MasterComplianceChecklist implements IMasterComplianceChecklist {
  constructor(
    public id?: number,
    public regItemNo?: number,
    public regulationName?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}

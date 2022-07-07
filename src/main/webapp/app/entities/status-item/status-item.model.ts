export interface IStatusItem {
  id?: number;
  statusName?: string;
  sequence?: number;
  statusCode?: string;
  description?: string;
  statusTypeId?: string;
  statusTypeDescription?: string;
  caption?: string;
  icon?: string;
}

export class StatusItem implements IStatusItem {
  constructor(
    public id?: number,
    public statusName?: string,
    public sequence?: number,
    public statusCode?: string,
    public description?: string,
    public statusTypeId?: string,
    public statusTypeDescription?: string,
    public caption?: string,
    public icon?: string
  ) {}
}

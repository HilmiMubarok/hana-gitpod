export interface IBaseApplication {
  id?: number;
  applicationNumber?: string;
  description?: string;
  applicationTypeDescription?: string;
  applicationTypeId?: string;
  internalName?: string;
  internalId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
  notes?: any[];
}

export class BaseApplication implements IBaseApplication {
  constructor(
    public id?: number,
    public applicationNumber?: string,
    public description?: string,
    public applicationTypeDescription?: string,
    public applicationTypeId?: string,
    public internalName?: string,
    public internalId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any,
    public notes?: any[]
  ) {}
}

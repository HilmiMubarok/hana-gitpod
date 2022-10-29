export interface IApplicationOption {
  id?: string;
  value?: string;
  dataType?: string;
  description?: string;
  attributes?: any;
}

export class ApplicationOption implements IApplicationOption {
  constructor(public id?: string, public value?: string, public dataType?: string, public description?: string, public attributes?: any) {}
}

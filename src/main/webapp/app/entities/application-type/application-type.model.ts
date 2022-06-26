export interface IApplicationType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class ApplicationType implements IApplicationType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}

export interface IIdentificationType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class IdentificationType implements IIdentificationType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}

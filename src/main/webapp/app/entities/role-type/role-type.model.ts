export interface IRoleType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class RoleType implements IRoleType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}

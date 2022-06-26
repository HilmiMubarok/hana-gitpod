export interface IGLResourceType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class GLResourceType implements IGLResourceType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}

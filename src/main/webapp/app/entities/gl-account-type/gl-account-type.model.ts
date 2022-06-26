export interface IGLAccountType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class GLAccountType implements IGLAccountType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}

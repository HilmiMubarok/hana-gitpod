export interface IGLAccountClass {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class GLAccountClass implements IGLAccountClass {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}

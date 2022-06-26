export interface IPartyCategoryType {
  id?: string;
  description?: string;
  multiple?: boolean;
  parentDescription?: string;
  parentId?: string;
}

export class PartyCategoryType implements IPartyCategoryType {
  constructor(
    public id?: string,
    public description?: string,
    public multiple?: boolean,
    public parentDescription?: string,
    public parentId?: string
  ) {
    this.multiple = this.multiple || false;
  }
}

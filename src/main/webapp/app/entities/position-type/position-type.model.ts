export interface IPositionType {
  id?: string;
  description?: string;
  title?: string;
  numOfPosition?: number;
  parentDescription?: string;
  parentId?: string;
  internalTypeDescription?: string;
  internalTypeId?: string;
}

export class PositionType implements IPositionType {
  constructor(
    public id?: string,
    public description?: string,
    public title?: string,
    public numOfPosition?: number,
    public parentDescription?: string,
    public parentId?: string,
    public internalTypeDescription?: string,
    public internalTypeId?: string
  ) {}
}

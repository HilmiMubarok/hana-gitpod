export interface IPeriod {
  id?: number;
  code?: string;
  description?: string;
  periodTypeDescription?: string;
  periodTypeId?: string;
  parentDescription?: string;
  parentId?: number;
  ownerName?: string;
  ownerId?: number;
  attributes?: any;
}

export class Period implements IPeriod {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public periodTypeDescription?: string,
    public periodTypeId?: string,
    public parentDescription?: string,
    public parentId?: number,
    public ownerName?: string,
    public ownerId?: number,
    public attributes?: any
  ) {}
}

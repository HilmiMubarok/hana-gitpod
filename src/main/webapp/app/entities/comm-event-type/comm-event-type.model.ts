export interface ICommEventType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  contactTypeDescription?: string;
  contactTypeId?: string;
}

export class CommEventType implements ICommEventType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public contactTypeDescription?: string,
    public contactTypeId?: string
  ) {}
}

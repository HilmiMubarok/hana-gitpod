export interface IContactMech {
  id?: number;
  description?: string;
  contactTypeDescription?: string;
  contactTypeId?: string;
  attributes?: any;
}

export class ContactMech implements IContactMech {
  constructor(
    public id?: number,
    public description?: string,
    public contactTypeDescription?: string,
    public contactTypeId?: string,
    public attributes?: any
  ) {}
}

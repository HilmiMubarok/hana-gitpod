import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';

export interface IContactMechType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  availablePurposes?: IPurposeType[];
}

export class ContactMechType implements IContactMechType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public availablePurposes?: IPurposeType[]
  ) {}
}

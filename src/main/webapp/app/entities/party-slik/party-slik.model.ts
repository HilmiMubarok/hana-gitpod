export interface IPartySlik {
  id?: number;
  partyId?: string;
}

export class PartySlik implements IPartySlik {
  constructor(public id?: number, public partyId?: string) {}
}

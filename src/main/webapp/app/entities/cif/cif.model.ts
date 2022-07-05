export interface ICif {
  id?: number;
  number?: string;
  partyId?: string;
}

export class Cif implements ICif {
  constructor(public id?: number, public number?: string, public partyId?: string) {}
}

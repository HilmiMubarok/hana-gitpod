export interface ICif {
  id?: number;
  number?: string | null;
  partyId?: string | null;
}

export class Cif implements ICif {
  constructor(public id?: number, public number?: string | null, public partyId?: string | null) {}
}

export function getCifIdentifier(cif: ICif): number | undefined {
  return cif.id;
}

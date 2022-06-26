export interface IReligionType {
  id?: string;
  description?: string;
}

export class ReligionType implements IReligionType {
  constructor(public id?: string, public description?: string) {}
}

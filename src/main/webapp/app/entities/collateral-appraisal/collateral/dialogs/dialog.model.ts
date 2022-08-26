export interface IFloor {
  floor?: number;
  area?: number;
}

export class Floor implements IFloor {
  constructor(public floor?: number, public area?: number) {}
}

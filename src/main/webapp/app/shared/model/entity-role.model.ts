export interface IEntityRole {
  partyId?: string;
  percent?: number;
  fromDate?: Date;
  thruDate?: Date;
}

export class EntityRole implements IEntityRole {
  constructor(public partyId?: string, public percent?: number, public fromDate?: Date, public thruDate?: Date) {
    this.fromDate = new Date();
    this.thruDate = new Date('9999-12-31T00:00:00Z');
    this.percent = 0;
  }
}

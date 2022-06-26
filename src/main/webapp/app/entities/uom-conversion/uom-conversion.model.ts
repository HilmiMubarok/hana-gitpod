export interface IUomConversion {
  id?: number;
  factor?: number;
  fromDate?: Date;
  thruDate?: Date;
  uomToDescription?: string;
  uomToId?: string;
  uomFromDescription?: string;
  uomFromId?: string;
}

export class UomConversion implements IUomConversion {
  constructor(
    public id?: number,
    public factor?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public uomToDescription?: string,
    public uomToId?: string,
    public uomFromDescription?: string,
    public uomFromId?: string
  ) {}
}

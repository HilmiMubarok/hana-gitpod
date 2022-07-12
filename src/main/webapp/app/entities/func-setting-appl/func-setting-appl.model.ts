export interface IFuncSettingAppl {
  id?: number;
  valueData?: string;
  fromDate?: Date;
  thruDate?: Date;
  featureApplicableId?: number;
  funcSettingDescription?: string;
  funcSettingId?: string;
}

export class FuncSettingAppl implements IFuncSettingAppl {
  constructor(
    public id?: number,
    public valueData?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public featureApplicableId?: number,
    public funcSettingDescription?: string,
    public funcSettingId?: string
  ) {}
}

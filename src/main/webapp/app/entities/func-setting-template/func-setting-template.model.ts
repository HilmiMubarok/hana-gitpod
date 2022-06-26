export interface IFuncSettingTemplate {
  id?: number;
  defaultValue?: string;
  fromDate?: Date;
  thruDate?: Date;
  productTypeDescription?: string;
  productTypeId?: string;
  featureDescription?: string;
  featureId?: string;
  funcSettingDescription?: string;
  funcSettingId?: string;
}

export class FuncSettingTemplate implements IFuncSettingTemplate {
  constructor(
    public id?: number,
    public defaultValue?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public productTypeDescription?: string,
    public productTypeId?: string,
    public featureDescription?: string,
    public featureId?: string,
    public funcSettingDescription?: string,
    public funcSettingId?: string
  ) {}
}

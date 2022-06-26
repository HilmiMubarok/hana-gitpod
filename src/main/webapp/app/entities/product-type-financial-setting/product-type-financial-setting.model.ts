import { IFuncSettingTemplate } from 'app/entities/func-setting-template/func-setting-template.model';

export interface IProductTypeFinancialSetting {
  id?: string;
  description?: string;
  physical?: boolean;
  digital?: boolean;
  parentDescription?: string;
  parentId?: string;
  funcSettingTemplates?: IFuncSettingTemplate[];
}

export class ProductTypeFinancialSetting implements IProductTypeFinancialSetting {
  constructor(
    public id?: string,
    public description?: string,
    public physical?: boolean,
    public digital?: boolean,
    public parentDescription?: string,
    public parentId?: string,
    public funcSettingTemplates?: IFuncSettingTemplate[]
  ) {
    this.physical = this.physical || false;
    this.digital = this.digital || false;
  }
}

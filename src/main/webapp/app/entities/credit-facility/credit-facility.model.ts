import { IFeatureApplicable } from '../feature-applicable/feature-applicable.model';
import { IFuncSettingAppl } from '../func-setting-appl/func-setting-appl.model';
import { IFuncSetting } from '../func-setting/func-setting.model';

export interface ICreditFacility {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  introDate?: Date;
  discontinueDate?: Date;
  productTypeDescription?: string;
  productTypeId?: string;
  attributes?: any;
  features?: IFeatureApplicable[];
  settings?: IFuncSettingAppl[];
}

export class CreditFacility implements ICreditFacility {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public introDate?: Date,
    public discontinueDate?: Date,
    public productTypeDescription?: string,
    public productTypeId?: string,
    public attributes?: any
  ) {}
}

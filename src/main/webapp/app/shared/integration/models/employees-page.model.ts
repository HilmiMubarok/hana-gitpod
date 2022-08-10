import { ILocalization } from './localization.model';
import { IStrapiModel } from './strapi-model.model';

export interface IEmployee extends IStrapiModel {
  pageAt?: string;
  title?: string;
  subTitle?: string;
  contentTitle?: string;
  employeeCode?: string;
  registrationDate?: string;
  internalName?: string;
  employmentType?: string;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public pageAt?: string,
    public title?: string,
    public subTitle?: string,
    public contentTitle?: string,
    public locale?: string,
    public localizations?: ILocalization[],
    public employeeCode?: string,
    public registrationDate?: string,
    public internalName?: string,
    public employmentType?: string
  ) {}
}

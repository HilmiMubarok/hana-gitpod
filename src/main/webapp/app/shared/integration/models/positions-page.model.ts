import { ILocalization } from './localization.model';
import { IStrapiModel } from './strapi-model.model';

export interface IPositions extends IStrapiModel {
  pageAt?: string;
  title?: string;
  contentTitle?: string;
  name?: string;
  position?: string;
  employee?: string;
  branch?: string;
  description?: string;
  action?: string;
  subTitle?: string;
  partyId?: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  internalId?: string;
}

export class Positions implements IPositions {
  constructor(
    public id?: number,
    public pageAt?: string,
    public title?: string,
    public contentTitle?: string,
    public subTitle?: string,
    public position?: string,
    public name?: string,
    public employee?: string,
    public branch?: string,
    public description?: string,
    public action?: string,
    public published_at?: Date,
    public created_at?: Date,
    public updated_at?: Date,
    public locale?: string,
    public localizations?: ILocalization[]
  ) {}
}

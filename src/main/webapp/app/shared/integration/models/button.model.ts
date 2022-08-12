import { ILocalization } from './localization.model';
import { IStrapiModel } from './strapi-model.model';

export interface IButton extends IStrapiModel {
  add?: string;
}

export class Button implements IButton {
  constructor(
    public id?: number,
    public add?: string,
    public published_at?: Date,
    public created_at?: Date,
    public updated_at?: Date,
    public locale?: string,
    public localizations?: ILocalization[]
  ) {}
}

import { ILocalization } from './localization.model';

export interface IStrapiModel {
  id?: number;
  updated_at?: Date;
  created_at?: Date;
  published_at?: Date;
  locale?: string;
  localizations?: ILocalization[];
}

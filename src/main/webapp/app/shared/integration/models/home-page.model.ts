import { ILocalization } from './localization.model';

export interface IHomePage {
  id?: number;
  content?: string;
  published_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  locale?: string;
  localizations?: ILocalization[];
}

export class HomePage implements IHomePage {
  constructor(
    public id?: number,
    public content?: string,
    public published_at?: Date,
    public created_at?: Date,
    public updated_at?: Date,
    public locale?: string,
    public localizations?: ILocalization[]
  ) {}
}

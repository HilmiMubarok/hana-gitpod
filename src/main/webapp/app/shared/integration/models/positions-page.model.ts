import { ILocalization } from './localization.model';

export interface IPositions {
  id?: number;
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
  updated_at?: Date;
  created_at?: Date;
  published_at?: Date;
  locale?: string;
  localizations?: ILocalization[];
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

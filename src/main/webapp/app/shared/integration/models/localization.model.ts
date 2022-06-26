export interface ILocalization {
  id?: number;
  locale?: string;
  published_at?: Date;
}

export class Localization implements ILocalization {
  constructor(public id?: number, public locale?: string, public published_at?: Date) {}
}

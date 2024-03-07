export interface IDueDate {
  noOverdue?: number;
  overDueLessThan?: number;
  overDueBetween?: number;
  moreThan?: number;
  date?: string;
  information?: IDateInformation[];
  showcase: IShowcase[];
}

export interface IDateInformation {
  description?: string;
  fromDate?: Date;
  thruDate?: Date;
}

export interface IShowcase {
  description?: string;
  fromDate?: Date;
  thruDate?: Date;
}

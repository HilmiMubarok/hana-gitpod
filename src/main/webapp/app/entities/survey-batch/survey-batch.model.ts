export interface ISurveyBatch {
  id?: number;
  surveyCompanyId?: number;
  statusId?: string;
  statusDescription?: string;
  receivedDate?: Date;
}

export class SurveyBatch implements ISurveyBatch {
  constructor(
    public id?: number,
    public surveyCompanyId?: number,
    public statusId?: string,
    public statusDescription?: string,
    public receivedDate?: Date
  ) {}
}

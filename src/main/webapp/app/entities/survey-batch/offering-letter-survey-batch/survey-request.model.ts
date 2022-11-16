import { IPartner, Partner } from "app/entities/partner/partner.model";

export interface ISurveyRequest {
  id?: number;
  requestDate?: Date;
  requestNo?: string;
  cost?: number;
  description?: string;
  surveyCompany?: IPartner,
  appraisalId?: number[]
}

export class SurveyRequest implements ISurveyRequest {
  constructor(
    public id?: number,
    public requestDate?: Date,
    public requestNo?: string,
    public cost?: number,
    public description?: string,
    public surveyCompany?: IPartner,
    public appraisalId?: number[]
  ) {
    this.surveyCompany = new Partner();
  }
}

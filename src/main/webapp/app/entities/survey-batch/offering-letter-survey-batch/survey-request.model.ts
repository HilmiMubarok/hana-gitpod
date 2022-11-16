import { IPartner, Partner } from "app/entities/partner/partner.model";

export interface ISurveyRequest {
  id?: number;
  requestDate?: Date;
  surveyCompanyId?: number;
  surveyCompanyOrgId?: string;
  surveyCompanyName?: string;
  requestNo?: string;
  cost?: number;
  description?: string;
  attributes?: object;
  collateralAppraisalIds?: number[]
}

export class SurveyRequest implements ISurveyRequest {
  constructor(
    public id?: number,
    public requestDate?: Date,
    public surveyCompanyId?: number,
    public surveyCompanyOrgId?: string,
    public surveyCompanyName?: string,
    public requestNo?: string,
    public cost?: number,
    public description?: string,
    public attributes?: object,
    public collateralAppraisalIds?: number[]
  ) {
    this.attributes = {};
  }
}

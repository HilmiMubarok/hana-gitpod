import { IMasterParameter } from '../master-parameter.model';

export interface IIndustryLimitExposureParameter {
  industry?: string;
  industryLabel?: string;
  limitPercentage?: number;
  limitNominal?: number;
  remainingBalance?: number;
  industryLimitExposure?: number;
  statusId?: string;
}

export class IndustryLimitExposureParameter implements IIndustryLimitExposureParameter {
  constructor(
    public id?: number,
    public status?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public industry?: string,
    public industryLabel?: string,
    public limitPercentage?: number,
    public limitNominal?: number,
    public remainingBalance?: number,
    public industryLimitExposure?: number,
    public statusId?: string
  ) {}
}

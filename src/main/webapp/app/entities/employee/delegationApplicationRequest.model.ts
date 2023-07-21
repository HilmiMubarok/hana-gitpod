import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { ISurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { IEmployee } from './employee.model';

export interface IDelegationApplicationRequest {
  id?: number;
  fromEmployeeId?: number;
  toEmployeeId?: number;
  fromDate?: Date;
  thruDate?: Date;
  reason?: string;
  loanApplications?: ICreditProposal[];
}

export class DelegationApplicationRequest implements IDelegationApplicationRequest {
  constructor(
    public id?: number,
    public fromEmployeeId?: number,
    public toEmployeeId?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public reason?: string,
    public loanApplications?: ICreditProposal[]
  ) {}
}

export interface IDelegationAppraisalRequest {
  id?: number;
  fromEmployee?: IEmployee;
  toEmployee?: IEmployee;
  fromDate?: Date;
  thruDate?: Date;
  reason?: string;
  appraisals?: ISurveyAppraisals[];
}

export class DelegationAppraisalRequest implements IDelegationAppraisalRequest {
  constructor(
    public id?: number,
    public fromEmployee?: IEmployee,
    public toEmployee?: IEmployee,
    public fromDate?: Date,
    public thruDate?: Date,
    public reason?: string,
    public appraisals?: ISurveyAppraisals[]
  ) {}
}

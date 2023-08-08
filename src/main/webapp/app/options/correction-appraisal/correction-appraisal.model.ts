import { IPosition } from 'app/entities/position/position.model';

export interface ICorrectionAppraisal {
  appraisalId?: number;
  selectedPosition?: IPosition[];
}

export class CorrectionAppraisal implements ICorrectionAppraisal {
  constructor(public appraisalId?: number, public selectedPosition?: IPosition[]) {
    this.selectedPosition = [];
  }
}

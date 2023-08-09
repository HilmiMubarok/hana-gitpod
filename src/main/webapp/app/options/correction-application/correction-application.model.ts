import { IPosition } from 'app/entities/position/position.model';

export interface ICorrectionApplication {
  applicationId?: number;
  selectedPosition?: IPosition[];
}

export class CorrectionApplication implements ICorrectionApplication {
  constructor(public applicationId?: number, public selectedPosition?: IPosition[]) {
    this.selectedPosition = [];
  }
}

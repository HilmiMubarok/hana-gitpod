export interface IChecklist {
  criteria?: string;
  value?: string;
  remarks?: string;
}

export class CollateralInfoChecklist implements IChecklist {
  constructor(public criteria?: string, public value?: string, public remarks?: string, public checklistValue?: IChecklist[]) {
    this.criteria = '';
    this.value = '';
    this.remarks = '';
    this.checklistValue = [];
  }
}

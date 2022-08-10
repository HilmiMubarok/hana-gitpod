import { IProcessTask } from 'app/shared/model/process-task.model';

import { ICif } from '../cif/cif.model';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';

export interface ICifCollateralAppraisal {
  cif?: ICif;
  collateralAppraisals?: ICollateralAppraisal[];
}

export class CifCollateralAppraisal implements ICifCollateralAppraisal {
  constructor(public cif?: ICif, public collateralAppraisals?: ICollateralAppraisal[]) {}
}

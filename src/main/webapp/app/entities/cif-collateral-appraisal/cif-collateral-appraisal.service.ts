import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICifCollateralAppraisal } from './cif-collateral-appraisal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class CifCollateralAppraisalService extends AbstractEntityService<ICifCollateralAppraisal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/cif-collateral-appraisals');
  }

  /* protected isNew(entity: ICifCollateralAppraisal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICifCollateralAppraisal>): HttpResponse<ICifCollateralAppraisal> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICifCollateralAppraisal[]>): HttpResponse<ICifCollateralAppraisal[]> {
    res.body.forEach((cifCollateralAppraisal: ICifCollateralAppraisal) => {
      cifCollateralAppraisal.fromDate = cifCollateralAppraisal.fromDate != null ? new Date(cifCollateralAppraisal.fromDate) : null;
      cifCollateralAppraisal.thruDate = cifCollateralAppraisal.thruDate != null ? new Date(cifCollateralAppraisal.thruDate) : null;
    });
    return res;
  }*/

  protected preSave(entity: ICifCollateralAppraisal) {}
}

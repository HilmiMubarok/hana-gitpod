import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ILendingProgramParameter } from './lending-program-parameter.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class LendingProgramParameterService extends AbstractEntityService<ILendingProgramParameter> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/lending-programs');
  }

  protected isNew(entity: ILendingProgramParameter): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ILendingProgramParameter>): HttpResponse<ILendingProgramParameter> {
    res.body.createdDate = res.body.createdDate != null ? new Date(res.body.createdDate) : null;
    res.body.lastModifiedDate = res.body.lastModifiedDate != null ? new Date(res.body.lastModifiedDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ILendingProgramParameter[]>): HttpResponse<ILendingProgramParameter[]> {
    res.body.forEach((lendingProgramParameter: ILendingProgramParameter) => {
      lendingProgramParameter.createdDate =
        lendingProgramParameter.createdDate != null ? new Date(lendingProgramParameter.createdDate) : null;
      lendingProgramParameter.lastModifiedDate =
        lendingProgramParameter.lastModifiedDate != null ? new Date(lendingProgramParameter.lastModifiedDate) : null;
    });
    return res;
  }

  protected preSave(entity: ILendingProgramParameter) {}
}

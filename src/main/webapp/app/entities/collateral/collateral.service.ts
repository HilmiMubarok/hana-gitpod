import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateral } from './collateral.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class CollateralService extends AbstractEntityService<ICollateral> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/collaterals');
  }

  protected isNew(entity: ICollateral): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICollateral>): HttpResponse<ICollateral> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICollateral[]>): HttpResponse<ICollateral[]> {
    res.body.forEach((collateral: ICollateral) => {
      collateral.fromDate = collateral.fromDate != null ? new Date(collateral.fromDate) : null;
      collateral.thruDate = collateral.thruDate != null ? new Date(collateral.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: ICollateral) {}
}

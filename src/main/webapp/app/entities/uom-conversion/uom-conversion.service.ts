import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IUomConversion } from './uom-conversion.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class UomConversionService extends AbstractEntityService<IUomConversion> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/uom-conversions');
  }

  protected isNew(entity: IUomConversion): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IUomConversion>): HttpResponse<IUomConversion> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IUomConversion[]>): HttpResponse<IUomConversion[]> {
    res.body.forEach((uomConversion: IUomConversion) => {
      uomConversion.fromDate = uomConversion.fromDate != null ? new Date(uomConversion.fromDate) : null;
      uomConversion.thruDate = uomConversion.thruDate != null ? new Date(uomConversion.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IUomConversion) {}
}

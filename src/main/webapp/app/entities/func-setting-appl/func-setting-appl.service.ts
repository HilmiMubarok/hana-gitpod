import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFuncSettingAppl } from './func-setting-appl.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class FuncSettingApplService extends AbstractEntityService<IFuncSettingAppl> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/func-setting-appls');
  }

  protected isNew(entity: IFuncSettingAppl): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IFuncSettingAppl>): HttpResponse<IFuncSettingAppl> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IFuncSettingAppl[]>): HttpResponse<IFuncSettingAppl[]> {
    res.body.forEach((funcSettingAppl: IFuncSettingAppl) => {
      funcSettingAppl.fromDate = funcSettingAppl.fromDate != null ? new Date(funcSettingAppl.fromDate) : null;
      funcSettingAppl.thruDate = funcSettingAppl.thruDate != null ? new Date(funcSettingAppl.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IFuncSettingAppl) {}
}

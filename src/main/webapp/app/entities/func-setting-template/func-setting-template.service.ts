import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFuncSettingTemplate } from './func-setting-template.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class FuncSettingTemplateService extends AbstractEntityService<IFuncSettingTemplate> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/func-setting-templates');
  }

  protected isNew(entity: IFuncSettingTemplate): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IFuncSettingTemplate>): HttpResponse<IFuncSettingTemplate> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IFuncSettingTemplate[]>): HttpResponse<IFuncSettingTemplate[]> {
    res.body.forEach((funcSettingTemplate: IFuncSettingTemplate) => {
      funcSettingTemplate.fromDate = funcSettingTemplate.fromDate != null ? new Date(funcSettingTemplate.fromDate) : null;
      funcSettingTemplate.thruDate = funcSettingTemplate.thruDate != null ? new Date(funcSettingTemplate.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: IFuncSettingTemplate) {}
}

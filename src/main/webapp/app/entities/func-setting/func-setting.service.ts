import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFuncSetting } from './func-setting.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class FuncSettingService extends AbstractEntityService<IFuncSetting> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/func-settings');
  }

  protected isNew(entity: IFuncSetting): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IFuncSetting) {}
}

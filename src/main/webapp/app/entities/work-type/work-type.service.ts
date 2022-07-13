import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IWorkType, WorkType } from './work-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkTypeService extends AbstractEntityService<IWorkType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/mastercontrol/api/work-types');
  }

  protected isNew(entity: IWorkType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IWorkType) {}
}

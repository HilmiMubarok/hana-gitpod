import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICommEventType } from './comm-event-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class CommEventTypeService extends AbstractEntityService<ICommEventType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/comm-event-types');
  }

  protected isNew(entity: ICommEventType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ICommEventType) {}
}

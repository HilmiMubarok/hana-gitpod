import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IContactMech } from './contact-mech.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ContactMechService extends AbstractEntityService<IContactMech> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/contact-meches');
  }

  protected isNew(entity: IContactMech): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IContactMech) {}
}

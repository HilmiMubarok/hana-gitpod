import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IContactMechType } from './contact-mech-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ContactMechTypeService extends AbstractEntityService<IContactMechType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/contact-mech-types');
  }

  protected isNew(entity: IContactMechType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IContactMechType) {}
}

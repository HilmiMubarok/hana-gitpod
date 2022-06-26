import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPerson } from './person.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PersonService extends AbstractEntityService<IPerson> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/people');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/people');
  }

  protected isNew(entity: IPerson): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPerson>): HttpResponse<IPerson> {
    res.body.dob = res.body.dob != null ? new Date(res.body.dob) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPerson[]>): HttpResponse<IPerson[]> {
    res.body.forEach((person: IPerson) => {
      person.dob = person.dob != null ? new Date(person.dob) : null;
    });
    return res;
  }

  protected preSave(entity: IPerson) {
    if (entity.firstName) {
      entity.firstName = entity.firstName.toUpperCase();
    }
    if (entity.middleName) {
      entity.middleName = entity.middleName.toUpperCase();
    }
    if (entity.lastName) {
      entity.lastName = entity.lastName.toUpperCase();
    }
    if (entity.mothersName) {
      entity.mothersName = entity.mothersName.toUpperCase();
    }
    if (entity.personalEmail) {
      entity.personalEmail = entity.personalEmail.toLowerCase();
    }
  }
}

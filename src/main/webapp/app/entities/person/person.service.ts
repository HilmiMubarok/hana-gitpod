import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPerson } from './person.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService extends AbstractEntityService<IPerson> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/person');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/person');
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

  public getBloodTypes(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/blood-type', {
      observe: 'response',
    });
  }

  public getGenders(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/gender', { observe: 'response' });
  }

  public preSave(entity: IPerson) {
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

    this.http.post<IPerson[]>(this.resourceSearchUrl, entity);
  }
}

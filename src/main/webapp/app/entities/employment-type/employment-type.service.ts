import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IEmploymentType } from './employment-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({ providedIn: 'root' })
export class EmploymentTypeService extends AbstractEntityService<IEmploymentType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/employment-types');
  }

  protected isNew(entity: IEmploymentType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IEmploymentType) {}
}

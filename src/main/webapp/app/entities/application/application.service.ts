import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IApplication } from './application.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class ApplicationService extends AbstractEntityService<IApplication> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/applications');
  }

  protected isNew(entity: IApplication): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IApplication>): HttpResponse<IApplication> {
    Object.keys(res.body.roles).forEach((key: string) => {
      const value = res.body.roles[key];
      value['fromDate'] != null ? new Date(value['fromDate']) : null;
      value['thruDate'] != null ? new Date(value['thruDate']) : null;
    });
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IApplication[]>): HttpResponse<IApplication[]> {
    res.body.forEach((application: IApplication) => {
      const roles = application.roles;
      Object.keys(roles).forEach((key: string) => {
        const value = roles[key];
        value['fromDate'] != null ? new Date(value['fromDate']) : null;
        value['thruDate'] != null ? new Date(value['thruDate']) : null;
      });
    });
    return res;
  }

  protected preSave(entity: IApplication) {}
}

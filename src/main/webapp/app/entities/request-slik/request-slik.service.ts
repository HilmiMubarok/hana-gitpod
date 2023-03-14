import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRequestSlik } from './request-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class RequestSlikService extends AbstractEntityService<any> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
  }

  protected isNew(entity: IRequestSlik): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl, { observe: 'response' });
  }

  // public createReqSlik(req): Observable<HttpResponse<any>> {
  //   const options = createRequestOption(req);

  //   return this.http.post<any>(this.resourceUrl, { params: options, observe: 'response' });
  // }

  protected preSave(entity: IRequestSlik) {}
}

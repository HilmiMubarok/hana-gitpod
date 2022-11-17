import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IInternal } from './internal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class InternalService extends AbstractEntityService<IInternal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/internal-types');
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/internals');
  }

  protected isNew(entity: IInternal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IInternal) {}

  queryCustom(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any>(this.resourceUrlNew, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
}

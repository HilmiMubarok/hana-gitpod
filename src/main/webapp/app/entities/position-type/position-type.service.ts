import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPositionType } from './position-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, map } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PositionTypeService extends AbstractEntityService<IPositionType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/position-types');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/position-types/search');
  }

  protected isNew(entity: IPositionType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPositionType) {}

  public findById(id: string): Observable<HttpResponse<IPositionType>> {
    return this.http.get<IPositionType>(this.resourceUrl + '/' + id, { observe: 'response' });
  }
  public positionSrc(req?: any): Observable<HttpResponse<IPositionType[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }
}

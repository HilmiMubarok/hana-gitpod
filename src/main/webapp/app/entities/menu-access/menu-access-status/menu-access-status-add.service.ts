import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject, map } from 'rxjs';
import { IStatusAccess, IStatusMenuAccess } from './menu-access-status.model';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class MenuAccessStatusAddService extends AbstractEntityService<IStatusAccess> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/cash-status-item/filterBy');
  }
  public paramTypeId: Subject<any> = new Subject();

  public getListMenuItem(req?: any): Observable<HttpResponse<IStatusAccess[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IStatusAccess[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IStatusAccess[]>) => this.preLoadItemArray(res)));
  }
}

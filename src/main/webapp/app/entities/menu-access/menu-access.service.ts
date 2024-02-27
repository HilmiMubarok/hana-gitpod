import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IMenuAccess, IPositionAccess } from './menu-access.model';

@Injectable({
  providedIn: 'root',
})
export class MenuAccessService extends AbstractEntityService<IMenuAccess> {
  menuPositionType;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.menuPositionType = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-position-type/groupBy/');
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-position-type');
    this.resourceUrlSegre = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/segregation-types');
  }

  public getMenuAccess(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.menuPositionType, { params: options, observe: 'response' });
  }

  public filterBy(req?: any): Observable<HttpResponse<IMenuAccess[]>> {
    const opt = createRequestOption(req);
    return this.http.get<IMenuAccess[]>(`${this.resourceUrl}/filterBy`, { observe: 'response', params: opt });
  }

  public paramTypeId: Subject<any> = new Subject();
  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }

  savePosition(entity: IPositionAccess) {
    this.http.post<IPositionAccess[]>(this.resourceUrl, entity).subscribe(response => alert('success'));
  }
}

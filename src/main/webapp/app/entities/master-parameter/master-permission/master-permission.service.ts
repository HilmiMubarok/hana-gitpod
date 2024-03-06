import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { IAppMenuPermission } from './master-permission.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class MasterPermissionService extends AbstractEntityService<IAppMenuPermission> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-permission');
  }

  public filterBy(req: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(`${this.resourceUrl}/filterBy`, { observe: 'response', params: options });
  }

  protected isNew(entity: IAppMenuPermission): boolean {
    return entity.id === undefined || entity.id === null;
  }
}

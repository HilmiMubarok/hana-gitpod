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
  protected isNew(entity: IAppMenuPermission): boolean {
    return entity.id === undefined || entity.id === null;
  }

  // public getAppMenuBucket(req?: any): Observable<HttpResponse<IAppMenuPermission[]>> {
  //   const options = createRequestOption(req);
  //   return this.http
  //     .get<IAppMenuPermission[]>(this.resourceUrl, { params: options, observe: 'response' })
  //     .pipe(map((res: HttpResponse<IAppMenuPermission[]>) => this.preLoadItemArray(res)));
  // }

  // public findPositionReportingStructureCp(idApplication: number) {
  //   return this.http.get<IPositionReportingStructure[]>(
  //     `${this.resourceUrlNew}/application/${idApplication}/find-base-on-owner/relation-type/CREDIT_PROPOSAL`,
  //     {
  //       observe: 'response',
  //     }
  //   );
  // }
}

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { IStatusAccess, IStatusMenuAccess } from './menu-access-status.model';

@Injectable({
  providedIn: 'root',
})
export class MenuAccessStatusService extends AbstractEntityService<IStatusMenuAccess> {
  statusmenuacces;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.statusmenuacces = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-status-item/groupBy/');
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-status-item');
  }

  public getAccessStatus(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.statusmenuacces, { params: options, observe: 'response' });
  }

  public paramTypeId: Subject<any> = new Subject();
  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }

  savePosition(entity: IStatusAccess) {
    this.http.post<IStatusAccess[]>(this.resourceUrl, entity).subscribe(response => alert('success'));
  }

  public getPositionStatus(id: string) {
    return this.http.get<any[]>(`${this.resourceUrl}?${id}`, {
      observe: 'response',
    });
  }

  public filterTableData(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.statusmenuacces + '/filterBy?', { params: options, observe: 'response' });
  }

  // saveStatus(entity: IStatusAccess) {
  //   this.http.post<IStatusAccess[]>(this.statusmenuacces, entity).subscribe(response => alert('success'));
  // }
}

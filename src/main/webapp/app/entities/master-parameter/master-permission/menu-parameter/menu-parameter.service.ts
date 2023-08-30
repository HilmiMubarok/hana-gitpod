import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { IMenuItem } from './menu-parameter.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class MenuParameterService extends AbstractEntityService<IMenuItem> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-item');
  }
  public paramTypeId: Subject<any> = new Subject();

  public getListMenuItem(req?: any): Observable<HttpResponse<IMenuItem[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IMenuItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IMenuItem[]>) => this.preLoadItemArray(res)));
  }

  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }
}

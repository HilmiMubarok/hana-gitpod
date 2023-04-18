import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { IGeneralParameter } from './general-parameter.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class GeneralParameterService extends AbstractEntityService<IGeneralParameter> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/general-parameter');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/parameter-types');
  }
  public paramTypeId: Subject<any> = new Subject();

  // public getListTypeGeneral(): Observable<HttpResponse<IGeneralParameter>> {
  //   return this.http.get<IGeneralParameter>(`${this.resourceUrlNew}`, { observe: 'response' });
  // }

  public getListTypeGeneral(req?: any): Observable<HttpResponse<IGeneralParameter[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<IGeneralParameter[]>(this.resourceUrlNew, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IGeneralParameter[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<IGeneralParameter[]>) => this.preLoadItemArray(res)));
  }

  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }
}

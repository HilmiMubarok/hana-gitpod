import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { IGeneralParameter } from './general-parameter.model';

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

  public getListTypeGeneral(): Observable<HttpResponse<IGeneralParameter>> {
    return this.http.get<IGeneralParameter>(`${this.resourceUrlNew}`, { observe: 'response' });
  }

  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }
}

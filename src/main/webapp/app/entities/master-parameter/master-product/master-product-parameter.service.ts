import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IMasterProductParameter } from './master-product-parameter.model';
import { Observable, Subject } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MasterProductParameterService extends AbstractEntityService<IMasterProductParameter> {
  public paramTypeId: Subject<any> = new Subject();

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/products');
    this.resourceLovUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/product-types');
  }

  public filterTableData(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl + '/filterBy?', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }

  public getLovFacilityType(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceLovUrl}/lov/facility-cashtype`, { observe: 'response' });
  }
  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }
}

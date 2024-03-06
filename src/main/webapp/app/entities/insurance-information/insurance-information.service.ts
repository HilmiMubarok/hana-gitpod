import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { InsuranceInformation } from './insurance-information.model';
import { Observable, map } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class InsuranceInformationService extends AbstractEntityService<InsuranceInformation> {
  public dataSourceInsurance: any[];
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.dataSourceInsurance = [];
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/insurance-agreements');
  }
  public getInsuranceInformation(collateralId: number): Observable<HttpResponse<InsuranceInformation[]>> {
    return this.http.get<InsuranceInformation[]>(`${this.resourceUrl}/collateral/${collateralId}`, { observe: 'response' });
  }
  public filterTableData(collateralId?: number): Observable<HttpResponse<any>> {
    const options = createRequestOption(collateralId);
    return this.http
      .get<any[]>(this.resourceUrl + '/collateral/' + collateralId, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }
}

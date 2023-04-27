import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICustomer } from '../customer/customer.model';
import { Observable } from 'rxjs';
import { IPosition } from '../position/position.model';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class CashCustomerService {
  public resourceUrl: string;
  public resourceSearchUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/cash-customers');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/cash-customers');
  }

  public loadCollateralReadyForAppraise(position: IPosition, params?: any): Observable<HttpResponse<ICustomer[]>> {
    const options = createRequestOption(params);
    return this.http.post<ICustomer[]>(`${this.resourceUrl}/get-all-by-internal`, position, { observe: 'response', params: options });
  }
}

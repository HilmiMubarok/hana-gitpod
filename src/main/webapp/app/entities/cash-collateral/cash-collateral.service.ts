import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';

import { Subject } from 'rxjs';
import { ICollateralProperty, CollateralProperty } from '../collateral-property/collateral-property.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { OptionNode } from 'app/shared/model/option-node.model';

@Injectable({
  providedIn: 'root',
})
export class CashCollateralService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/cash-collateral');
  }

  public loadDetailType(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(`${this.resourceUrl}/detail-type`, { observe: 'response' });
  }

  public loadCollateralGradingType(): Observable<HttpResponse<OptionNode[]>> {
    return this.http.get<OptionNode[]>(`${this.resourceUrl}/grading-type`, { observe: 'response' });
  }
}

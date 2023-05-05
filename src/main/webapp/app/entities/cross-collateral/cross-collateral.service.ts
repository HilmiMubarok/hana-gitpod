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
export class CrossCollateralService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/cross-collaterals');
  }

  public filterTableData(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.resourceUrl + '/other-cifs?', { params: options, observe: 'response' });
  }
}

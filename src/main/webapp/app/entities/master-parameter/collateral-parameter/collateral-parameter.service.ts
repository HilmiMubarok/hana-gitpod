import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICollateralParameter } from './collateral-parameter.model';
@Injectable({
  providedIn: 'root',
})
export class CollateralParameterService extends AbstractEntityService<ICollateralParameter> {
  public paramTypeId: Subject<any> = new Subject();

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/collateral-parameters');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/collateral-propose-pricing-parameter');
  }

  setPrameterType(message: any) {
    this.paramTypeId.next(message);
  }
}

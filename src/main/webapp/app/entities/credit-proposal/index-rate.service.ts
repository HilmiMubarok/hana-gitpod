import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IindexRate } from './index-rate.model';

@Injectable({ providedIn: 'root' })
export class IndexRateService extends AbstractEntityService<IindexRate> {
  public statRemarkBusinessActivity;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/index-rates');
    this.resourceUrlNew = '';
    this.resourceSearchUrl = '';
    this.resourceCurrency = '';
    this.resourceRetrive = '';
  }

  protected isNew(entity: IindexRate): boolean {
    return entity.id === undefined || entity.id === null;
  }
}

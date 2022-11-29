import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';

@Injectable({
  providedIn: 'root',
})
export class IndustryLimitExposureParameterService extends AbstractEntityService<IIndustryLimitExposureParameter> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/industry-limit-exposure-parameter');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IMasterCreditAgreementClausal } from './master-credit-agreement-clausal.model';
@Injectable({
  providedIn: 'root',
})
export class MasterCreditAgreementClausalService extends AbstractEntityService<IMasterCreditAgreementClausal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/agreement-clausal-parameters');
  }
}

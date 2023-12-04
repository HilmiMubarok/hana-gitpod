import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, Subject } from 'rxjs';
import { IMasterFinancialInstitution } from './master-financial-institution.model';
@Injectable({
  providedIn: 'root',
})
export class MasterFinancialInstitutionService extends AbstractEntityService<IMasterFinancialInstitution> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/financial-institute-parameters');
  }
  public paramTypeId: Subject<any> = new Subject();
}

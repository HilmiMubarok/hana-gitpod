import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { IMasterComplianceChecklist } from './master-compliance-checklist.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({
  providedIn: 'root',
})
export class MasterComplianceChecklistService extends AbstractEntityService<IMasterComplianceChecklist> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/compliance-checklist-regulations');
  }
}

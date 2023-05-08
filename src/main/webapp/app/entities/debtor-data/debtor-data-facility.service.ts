import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IDebtorData } from './debtor-data.model';
import { Observable } from 'rxjs';
import { IDebtorDataFacility } from './debtor-data-facility.model';

@Injectable({ providedIn: 'root' })
export class DebtorDataFacilityService extends AbstractEntityService<IDebtorDataFacility> {
  protected resourceUrlNewDebtor: string;
  protected resourceUrlGroup: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/debtor-facilities');
    this.resourceUrlGroup = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/group-debtor-facilities');
  }

  public getDebtorData(partyId: string): Observable<HttpResponse<IDebtorDataFacility[]>> {
    return this.http.get<IDebtorDataFacility[]>(`${this.resourceUrl}/list/${partyId}`, { observe: 'response' });
  }

  public getGroupData(partyId: string): Observable<HttpResponse<IDebtorDataFacility[]>> {
    return this.http.get<IDebtorDataFacility[]>(`${this.resourceUrlGroup}/list/${partyId}`, { observe: 'response' });
  }
}

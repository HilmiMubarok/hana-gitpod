import { Injectable } from '@angular/core';
import { IMainFacility } from './main-facility.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainFacilityService extends AbstractEntityService<IMainFacility> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/main-facilities');
  }

  public getFacilities(partyId: string): Observable<HttpResponse<IMainFacility[]>> {
    return this.http.get<IMainFacility[]>(`${this.resourceUrl}/list/${partyId}`, { observe: 'response' });
  }
}

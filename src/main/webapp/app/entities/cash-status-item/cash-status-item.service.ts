import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IStatusItem } from '../status-item/status-item.model';

@Injectable({ providedIn: 'root' })
export class CashStatusItemService {
  public resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/cash-status-item');
  }

  public filterBy(req?: any): Observable<HttpResponse<IStatusItem[]>> {
    const opt = createRequestOption(req);
    return this.http.get<IStatusItem[]>(`${this.resourceUrl}/filterBy`, { observe: 'response', params: opt });
  }
}

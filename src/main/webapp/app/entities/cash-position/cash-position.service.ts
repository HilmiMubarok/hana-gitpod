import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { IPositionType } from '../position-type/position-type.model';
import { createRequestOption } from 'app/core/request/request-util';
import { IInternal } from '../internal/internal.model';
import { IPosition } from '../position/position.model';

@Injectable({ providedIn: 'root' })
export class CashPositionService {
  public resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/cash-position');
  }

  public getPositionTypeByPartyId(idParty: string, params?: any): Observable<HttpResponse<IPositionType[]>> {
    const options = createRequestOption(params);
    return this.http.get<IPositionType[]>(`${this.resourceUrl}/get-position-type/party/${idParty}`, {
      observe: 'response',
      params: options,
    });
  }

  public getInternalByPartyIdAndPositionTypeId(
    idPositionType: string,
    idParty: string,
    params?: any
  ): Observable<HttpResponse<IInternal[]>> {
    const options = createRequestOption(params);
    return this.http.get<IInternal[]>(`${this.resourceUrl}/get-internal/position-type/${idPositionType}/party/${idParty}`, {
      observe: 'response',
      params: options,
    });
  }

  public filterBy(req?: any): Observable<HttpResponse<IPosition[]>> {
    const opt = createRequestOption(req);
    return this.http.get<IPosition[]>(`${this.resourceUrl}/filterBy`, { observe: 'response', params: opt });
  }
}

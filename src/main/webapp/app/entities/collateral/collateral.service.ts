import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateral } from './collateral.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollateralService extends AbstractEntityService<ICollateral> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/collaterals');
  }

  protected isNew(entity: ICollateral): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICollateral>): HttpResponse<ICollateral> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICollateral[]>): HttpResponse<ICollateral[]> {
    res.body.forEach((collateral: ICollateral) => {
      collateral.fromDate = collateral.fromDate != null ? new Date(collateral.fromDate) : null;
      collateral.thruDate = collateral.thruDate != null ? new Date(collateral.thruDate) : null;
    });
    return res;
  }

  protected preSave(entity: ICollateral) {}

  public getLovReal(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/real-estate/', { observe: 'response' });
  }
  public getLovShop(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/shop-house/', { observe: 'response' });
  }
  public getLovFactory(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/factory-warehouse/', { observe: 'response' });
  }
  public getLovHotel(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/hotel-school/', { observe: 'response' });
  }
  public getLovKiosk(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/kiosk/', { observe: 'response' });
  }
  public getLovHouse(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/house/', { observe: 'response' });
  }
  public getLovApartment(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/apartment/', { observe: 'response' });
  }
  public getLovSlbc(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/sblc/', { observe: 'response' });
  }
  public getLovTd(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/td/', { observe: 'response' });
  }
  public getLovHeavy(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/heavy-equipment/', { observe: 'response' });
  }
  public getLovSecured(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/unsecured', { observe: 'response' });
  }
  public getLovLand(): Observable<HttpResponse<object[]>> {
    return this.http.get<object[]>(this.resourceUrl + '/lov/V2/land-plantation', { observe: 'response' });
  }
}

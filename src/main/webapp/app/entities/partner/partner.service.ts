import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartner } from './partner.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PartnerService extends AbstractEntityService<IPartner> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/partners');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/partners');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/partners/search');
  }

  protected isNew(entity: IPartner): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<IPartner>): HttpResponse<IPartner> {
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<IPartner[]>): HttpResponse<IPartner[]> {
    res.body.forEach((partner: IPartner) => {
      partner.fromDate = partner.fromDate != null ? new Date(partner.fromDate) : null;
      partner.thruDate = partner.thruDate != null ? new Date(partner.thruDate) : null;
    });
    return res;
  }
  public patnerSrc(req?: any): Observable<HttpResponse<IPartner[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  protected preSave(entity: IPartner) {}
}

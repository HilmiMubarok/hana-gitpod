import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikStatusService extends AbstractEntityService<any> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik');
  }

  // Endpoint LOV -> los/api/general-parameter/filterBy?idParameterType=REQUEST_PURPOSE_SLIK
  public getLovProposeCode() {
    const endPoint = 'REQUEST_PURPOSE_SLIK';
    return this.http
      .get(
        this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + `/api/general-parameter/filterBy?idParameterType=${endPoint}`),
        {
          observe: 'response',
        }
      )
      .pipe(map(res => res.body));
  }

  // Get Statuses
  public getStatuses() {
    return this.http.get<any>(this.resourceUrl + '/status', { observe: 'response' }).pipe(map(res => res.body.data));
  }

  public changeReqSlikStatus(reqSlikId, toStatus: string) {
    return this.http.put<any>(this.resourceUrl + '/status/' + reqSlikId, { status: toStatus }, { observe: 'response' });
  }

  public updateRequestSlik(reqSlik) {
    // endpoint -> los/api/slik/request/id
    // body -> requestSlik Object

    // remove dateCreate and dateModified from reqSlik
    delete reqSlik.dateCreate;
    delete reqSlik.dateModified;

    return this.http.put(this.resourceUrl + '/' + reqSlik.id, reqSlik, { observe: 'response' });
  }
}

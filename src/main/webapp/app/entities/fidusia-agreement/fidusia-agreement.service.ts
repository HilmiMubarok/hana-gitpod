import { Injectable } from '@angular/core';
import { IFidusiaAgremeent } from './fidusia-agreement.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, map } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class FidusiaAgreementService {
  public resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/fidusia-agreements');
  }

  public getData(idApplication: number, idCollateral: number): Observable<HttpResponse<IFidusiaAgremeent[]>> {
    return this.http.get<IFidusiaAgremeent[]>(this.resourceUrl + '/application/' + idApplication + '/collateral/' + idCollateral, {
      observe: 'response',
    });
  }
  public getTemplate(idApplication: number, idCollateral: number): Observable<IFidusiaAgremeent> {
    return this.http.get<IFidusiaAgremeent>(
      this.resourceUrl + '/template/sht/application/' + idApplication + '/collateral/' + idCollateral
    );
  }

  public createData(data: IFidusiaAgremeent): Observable<IFidusiaAgremeent> {
    return this.http.post<IFidusiaAgremeent>(this.resourceUrl, data);
  }

  public updateData(id: number, data: IFidusiaAgremeent): Observable<IFidusiaAgremeent> {
    return this.http.put<IFidusiaAgremeent>(this.resourceUrl + '/' + id, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from '../../shared/constants/config.constants';
import { Observable } from 'rxjs';
import { IOptionNode } from 'app/shared/model/option-node.model';

@Injectable({
  providedIn: 'root',
})
export class MasterInitialDebtorDataService {
  public resourceUrl: string;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/master-initial-debtor-data');
  }

  public getMaritalStatus(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/marital-status', { observe: 'response' });
  }

  public getPosition(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/position', { observe: 'response' });
  }

  public getSourceIncome(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/source-income', { observe: 'response' });
  }

  public getPurposeSourceIncome(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/purpose-source-income', { observe: 'response' });
  }

  public getLineOfBusiness(): Observable<HttpResponse<IOptionNode[]>> {
    return this.http.get<IOptionNode[]>(this.resourceUrl + '/line-of-business', { observe: 'response' });
  }
}

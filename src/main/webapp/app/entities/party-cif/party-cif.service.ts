import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPartyCif } from './party-cif.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IDebtorData } from '../debtor-data/debtor-data.model';

@Injectable({ providedIn: 'root' })
export class PartyCifService extends AbstractEntityService<IPartyCif> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/party-cifs');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/party-cifs');
    this.resourceSyncHobis = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/party-cifs');
    this.resourceUrlBrance = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/internals');
  }

  protected isNew(entity: IPartyCif): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPartyCif) {}

  public getMyBusinessGroup(cif: string): Observable<HttpResponse<IDebtorData[]>> {
    return this.http.get<IDebtorData[]>(`${this.resourceUrl}/my-business-group/${cif}`, { observe: 'response' });
  }

  public findCif(cif: string): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrl}/cif/find/${cif}`, { observe: 'response' });
  }

  public findLikeCif(cif: string, req: any): Observable<HttpResponse<IPartyCif[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPartyCif[]>(this.resourceUrl + '/cif/like/' + cif, { params: options, observe: 'response' });
  }

  public findPartyGroupByCif(cif: string): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrl}/party-group/cif/${cif}`, { observe: 'response' });
  }

  public findPartyId(param: IPartyCif): string {
    return param.customerOrganization ? param.customerOrganization.id : param.customerPerson.id;
  }

  public syncCollateralHobis(cif: string): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrl}/cif/find-collateral/${cif}`, { observe: 'response' });
  }

  public getLineOfBussines(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrl}/lov/lob-detail/`, { observe: 'response' });
  }

  public syncUpdateHobis(cif: string): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrl}/cif/find-update/${cif}`, { observe: 'response' });
  }

  public getManagementBranc(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrl}/lov/management-branch/`, { observe: 'response' });
  }

  public geBranches(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceUrlBrance}/filterBy?idInternalType=BRANCH`, { observe: 'response' });
  }

  public getGuarantee(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceSyncHobis}/lov/guarantee-coverage`, { observe: 'response' });
  }

  public getCertificate(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceSyncHobis}/lov/certificate-type`, { observe: 'response' });
  }

  public getDebitBlock(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceSyncHobis}/lov/debit-block`, { observe: 'response' });
  }

  public getMyFacilityBusinessGroup(cif: string): Observable<HttpResponse<IDebtorData[]>> {
    return this.http.get<IDebtorData[]>(`${this.resourceUrl}/facility-my-business-group/${cif}`, { observe: 'response' });
  }
  public getGroupCollateral(cif: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/collateral-my-business-group/${cif}`, { observe: 'response' });
  }

  public getBusinessGroup(cif: string): Observable<HttpResponse<IDebtorData[]>> {
    return this.http.get<IDebtorData[]>(`${this.resourceUrl}/my-business-group-cif/${cif}`, { observe: 'response' });
  }

  public getPep(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceSyncHobis}/lov/pep-status`, { observe: 'response' });
  }

  public getPositionManagement(): Observable<HttpResponse<IPartyCif>> {
    return this.http.get<IPartyCif>(`${this.resourceSyncHobis}/lov/management-position`, { observe: 'response' });
  }
}

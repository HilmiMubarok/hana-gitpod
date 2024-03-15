import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ITboCheckingModel } from './tbo-checking/tbo-checking.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map, Observable, Subject } from 'rxjs';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import moment from 'moment';
import { createRequestOption } from 'app/core/request/request-util';
import { DelegationApplicationRequest } from 'app/entities/employee/delegationApplicationRequest.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';

@Injectable({ providedIn: 'root' })
export class CashTboLegalMonitoringService extends AbstractEntityService<ITboCheckingModel> {
  private resourceUrlCashCreditProposal: string;
  public statRemarkBusinessActivity;
  public partySliks = [];
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.statRemarkBusinessActivity = '';
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api');
    this.resourceUrlCashCreditProposal = this.resourceUrl + '/cash-credit-proposals';
  }

  cashCreditProposalApprovalByStatus(req?: any): Observable<HttpResponse<ITboCheckingModel[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ITboCheckingModel[]>(this.resourceUrl + '/cash-credit-proposals/by-status', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }
  queryDelegationApplicationFilterBy(req?: any): Observable<HttpResponse<ITboCheckingModel[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ITboCheckingModel[]>(this.resourceUrl + '/delegation-application/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }

  queryListOfViewStatusFilterBy(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl + '/app-menu-status-item/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }
  public addDelegation(entity: ITboCheckingModel, params?: any): Observable<HttpResponse<DelegationApplicationRequest>> {
    this.preSave(entity);
    const options = createRequestOption(params);
    return this.http
      .post<ITboCheckingModel>(this.resourceUrl + '/delegation-application', entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<ITboCheckingModel>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel>) => this.preLoadItem(res)));
  }

  public getMyApplication(idParty: string, idPositionType: string, req?: any): Observable<HttpResponse<ITboCheckingModel[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ITboCheckingModel[]>(this.resourceUrl + '/cash-credit-proposal/my-application/' + idParty + '/position-type/' + idPositionType, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }

  cashCreditProposalApproval(req?: any): Observable<HttpResponse<ITboCheckingModel[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ITboCheckingModel[]>(this.resourceUrl + '/cash-credit-proposals/cp-status-approval', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }

  searchCP(req?: any): Observable<HttpResponse<ITboCheckingModel[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ITboCheckingModel[]>(this.resourceUrl + '/_search/cash-credit-proposals', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }

  darRevision(req?: any): Observable<HttpResponse<ITboCheckingModel[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ITboCheckingModel[]>(this.resourceUrl + '/cash-credit-proposal/dar-revision', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }

  public totalChanges: Subject<any> = new Subject();

  protected isNew(entity: ITboCheckingModel): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getIncorrectData(req?: any): Observable<HttpResponse<ILoanApplication[]>> {
    const options = createRequestOption(req);
    return this.http.get<ILoanApplication[]>(this.resourceUrlCashCreditProposal + '/unknown-pic', { params: options, observe: 'response' });
  }

  public getCertificationDate(collateral: ICollateral, properties: ICollateralProperty[]): string {
    let result: string;
    result = '';

    if (collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] || collateral.collateralTypeId === COLLATERAL_TYPE['property']) {
      if (properties.length > 0) {
        result = result + '<ul>';
        for (let i = 0; i < properties.length; i++) {
          const property: ICollateralProperty = properties[i];
          if (property.dueDate) {
            result = result + '<li>' + moment(property.dueDate).format('DD-MM-YYYY') + '</li>';
          }
        }
        result = result + '</ul>';
      }
    }
    return result;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ITboCheckingModel[]>): HttpResponse<ITboCheckingModel[]> {
    res.body.forEach((creditProposal: ITboCheckingModel) => {
      //
      if (creditProposal.prospectPerson) {
        creditProposal.prospectPerson.dob = creditProposal.prospectPerson.dob ? new Date(creditProposal.prospectPerson.dob) : null;
      }
      if (creditProposal.spouse) {
        creditProposal.spouse.dob = creditProposal.spouse.dob ? new Date(creditProposal.spouse.dob) : null;
      }
      if (creditProposal.contact) {
        creditProposal.contact.dob = creditProposal.contact.dob ? new Date(creditProposal.contact.dob) : null;
      }
    });
    return res;
  }

  protected preSave(entity: ITboCheckingModel) {
    if (entity.prospectPerson) {
      entity.prospectPerson.dob = new Date(entity.prospectPerson.dob);
    }

    if (entity.prospectOrganization) {
      console.log('xxx');
    }
  }

  public findByCif(cif: string): Observable<HttpResponse<ITboCheckingModel>> {
    return this.http.get<ITboCheckingModel>(this.resourceUrl + '/cif/' + cif, { observe: 'response' });
  }

  public findPersonTemplate(cif: string): Observable<HttpResponse<ITboCheckingModel>> {
    return this.http.get<ITboCheckingModel>(this.resourceUrl + '/cif-person-template/' + cif, { observe: 'response' });
  }

  public findPartyGroupTemplate(cif: string): Observable<HttpResponse<ITboCheckingModel>> {
    return this.http.get<ITboCheckingModel>(this.resourceUrl + '/cif-organization-template/' + cif, { observe: 'response' });
  }

  public sendNotification(idApp: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl + '/send-notification-dar/' + idApp, { observe: 'response' });
  }

  // public getStatus(): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(this.resourceUrl + '/lov/credit-proposal-status', { observe: 'response' });
  // }
  public getStatus(path: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '/lov/' + path, { observe: 'response' });
  }

  public getCurrency(idUomFrom: string, idUomTo: string, effDate: string): Observable<HttpResponse<any[]>> {
    const params = new HttpParams().set('idUomFrom', idUomFrom).set('idUomTo', 'IDR').set('effDate', effDate);

    return this.http.get<any[]>(this.resourceCurrency + '/filterBy?', { params, observe: 'response' });
  }

  public getRetriveData(cif: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceRetrive + '/find-fin-analysis/' + cif, { observe: 'response' });
  }
  public getListRetrive(cif?: string, req?: any): Observable<HttpResponse<any>> {
    // const params = new HttpParams().set('page', page).set('size', size);
    // return this.http.get<any>(this.resouceGridRetrive + cif, { params, observe: 'response' });
    const options = createRequestOption(req);
    const url = this.resouceGridRetrive + cif;
    return this.http
      .get<ITboCheckingModel[]>(url, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ITboCheckingModel[]>) => this.preLoadItemArray(res)));
  }

  public getListCurency(page: number, size: number): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.resourcelistCurrency + '/uoms', { params, observe: 'response' });
  }

  // settotal
  setTotalChanges(message: any) {
    this.totalChanges.next(message);
  }

  public getFacilityTypeProduct(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceFacility}/lov/product-facilitytype`, { observe: 'response' });
  }

  public getFacilityType(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceFacility}/lov/facility-cashtype`, { observe: 'response' });
  }

  public getFacilityTypeCash(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceFacility}/lov/product-cashtype`, { observe: 'response' });
  }

  public getFacilityProductList(facType: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceFacility}/lov/product-list-by-facility/` + facType, { observe: 'response' });
  }

  // public getFacilityProductList(): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(`${this.resourceFacility}/lov/product-list`, { observe: 'response' });
  // }
}

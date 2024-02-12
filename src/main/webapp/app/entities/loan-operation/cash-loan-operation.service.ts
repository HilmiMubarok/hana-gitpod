import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map, Observable, Subject } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import moment from 'moment';
import { createRequestOption } from 'app/core/request/request-util';
import { DelegationApplicationRequest } from '../employee/delegationApplicationRequest.model';
import { ILoanApplication } from '../loan-application/loan-application.model';
import { ILoanOPS } from './loan-operation.model';

@Injectable({ providedIn: 'root' })
export class CashLoanOperationService extends AbstractEntityService<ILoanOPS> {
  private resourceUrlCashCreditProposal: string;
  public statRemarkBusinessActivity;
  public partySliks = [];
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.statRemarkBusinessActivity = '';
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api');
    this.resourceUrlCashCreditProposal = this.resourceUrl + '/cash-credit-proposals';
  }

  cashCreditProposalApprovalByStatus(req?: any): Observable<HttpResponse<ILoanOPS[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanOPS[]>(this.resourceUrl + '/cash-credit-proposals/by-status', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
  }
  queryDelegationApplicationFilterBy(req?: any): Observable<HttpResponse<ILoanOPS[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanOPS[]>(this.resourceUrl + '/delegation-application/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
  }
  reviewDppkBystatus(req?: any): Observable<HttpResponse<ILoanOPS[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanOPS[]>(this.resourceUrl + '/cash-credit-proposal/review-dppk', {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
  }

  queryListOfViewStatusFilterBy(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl + '/app-menu-status-item/filterBy', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }
  public addDelegation(entity: ILoanOPS, params?: any): Observable<HttpResponse<DelegationApplicationRequest>> {
    this.preSave(entity);
    const options = createRequestOption(params);
    return this.http
      .post<ILoanOPS>(this.resourceUrl + '/delegation-application', entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<ILoanOPS>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS>) => this.preLoadItem(res)));
  }

  public getMyApplication(idParty: string, idPositionType: string, req?: any): Observable<HttpResponse<ILoanOPS[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanOPS[]>(this.resourceUrl + '/cash-credit-proposal/my-application/' + idParty + '/position-type/' + idPositionType, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
  }

  cashCreditProposalApproval(req?: any): Observable<HttpResponse<ILoanOPS[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanOPS[]>(this.resourceUrl + '/cash-credit-proposals/cp-status-approval', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
  }

  searchCP(req?: any): Observable<HttpResponse<ILoanOPS[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ILoanOPS[]>(this.resourceUrl + '/_search/cash-credit-proposals', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
  }

  public totalChanges: Subject<any> = new Subject();

  protected isNew(entity: ILoanOPS): boolean {
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

  protected convertDateArrayFromServer(res: HttpResponse<ILoanOPS[]>): HttpResponse<ILoanOPS[]> {
    res.body.forEach((creditAgreement: ILoanOPS) => {
      //
      if (creditAgreement.prospectPerson) {
        creditAgreement.prospectPerson.dob = creditAgreement.prospectPerson.dob ? new Date(creditAgreement.prospectPerson.dob) : null;
      }
      if (creditAgreement.spouse) {
        creditAgreement.spouse.dob = creditAgreement.spouse.dob ? new Date(creditAgreement.spouse.dob) : null;
      }
      if (creditAgreement.contact) {
        creditAgreement.contact.dob = creditAgreement.contact.dob ? new Date(creditAgreement.contact.dob) : null;
      }
    });
    return res;
  }

  protected preSave(entity: ILoanOPS) {
    if (entity.prospectPerson) {
      entity.prospectPerson.dob = new Date(entity.prospectPerson.dob);
    }

    if (entity.prospectOrganization) {
      console.log('xxx');
    }
  }

  public findByCif(cif: string): Observable<HttpResponse<ILoanOPS>> {
    return this.http.get<ILoanOPS>(this.resourceUrl + '/cif/' + cif, { observe: 'response' });
  }

  public findPersonTemplate(cif: string): Observable<HttpResponse<ILoanOPS>> {
    return this.http.get<ILoanOPS>(this.resourceUrl + '/cif-person-template/' + cif, { observe: 'response' });
  }

  public findPartyGroupTemplate(cif: string): Observable<HttpResponse<ILoanOPS>> {
    return this.http.get<ILoanOPS>(this.resourceUrl + '/cif-organization-template/' + cif, { observe: 'response' });
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
      .get<ILoanOPS[]>(url, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ILoanOPS[]>) => this.preLoadItemArray(res)));
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

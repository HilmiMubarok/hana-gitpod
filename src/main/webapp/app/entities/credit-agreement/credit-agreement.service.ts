import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditAgreement } from './credit-agreement.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map, Observable, Subject, BehaviorSubject } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import moment from 'moment';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreditAgreementClausal } from './finalize-credit-agreement/agreement-clausal.model';

@Injectable({ providedIn: 'root' })
export class CreditAgreementService extends AbstractEntityService<ICreditAgreement> {
  public statRemarkBusinessActivity;
  public partySliks = [];
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.statRemarkBusinessActivity = '';
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-proposals');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/credit-proposals/by-status');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/_search/credit-proposals');
    this.resourceCurrency = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/uom-conversions');
    this.resourceRetrive = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/party-cifs/cif');
    this.resouceGridRetrive = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/fin-statements/cif/');
    this.resourceFacility = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.HEIMDALL + '/api/partner-source-ep/');
  }

  public totalChanges: Subject<any> = new Subject();

  private changgedColRelByCP?: ICreditAgreement;
  private triggerChanggedColRelByCP = new BehaviorSubject<ICreditAgreement>(this.changgedColRelByCP);
  public triggerChanggedColRelByCPObservable = this.triggerChanggedColRelByCP.asObservable();

  public changeColRelByCP(newCP: ICreditAgreement) {
    this.changgedColRelByCP = newCP;
    this.triggerChanggedColRelByCP.next(this.changgedColRelByCP);
  }

  protected isNew(entity: ICreditAgreement): boolean {
    return entity.id === undefined || entity.id === null;
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

  public applicationGroubProduct(id: number): Observable<HttpResponse<any>> {
    return this.http
      .get<ICreditAgreement[]>(MICROSERVICENAME.LOS + '/api/application-group-products/page/' + id, { observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICreditAgreement[]>): HttpResponse<ICreditAgreement[]> {
    res.body.forEach((creditProposal: ICreditAgreement) => {
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

  protected preSave(entity: ICreditAgreement) {
    if (entity.attributes['collateralAfterData']) {
      if (typeof entity.attributes['collateralAfterData'] !== 'string') {
        entity.attributes['collateralAfterData'] = JSON.stringify(entity.attributes['collateralAfterData']);
      }
    }

    if (entity.attributes['collateralSummary']) {
      if (typeof entity.attributes['collateralSummary'] !== 'string') {
        entity.attributes['collateralSummary'] = JSON.stringify(entity.attributes['collateralSummary']);
      }
    }

    if (entity.attributes['collateralAfterReport']) {
      if (typeof entity.attributes['collateralAfterReport'] !== 'string') {
        entity.attributes['collateralAfterReport'] = JSON.stringify(entity.attributes['collateralAfterReport']);
      }
    }

    if (entity.attributes['groupChecklisCollateral']) {
      if (typeof entity.attributes['groupChecklisCollateral'] !== 'string') {
        entity.attributes['groupChecklisCollateral'] = JSON.stringify(entity.attributes['groupChecklisCollateral']);
      }
    }

    if (entity.attributes['collateralInfoGroupTotalMvLv']) {
      if (typeof entity.attributes['collateralInfoGroupTotalMvLv'] !== 'string') {
        entity.attributes['collateralInfoGroupTotalMvLv'] = JSON.stringify(entity.attributes['collateralInfoGroupTotalMvLv']);
      }
    }
    if (entity.attributes['certificateInfoData']) {
      if (typeof entity.attributes['certificateInfoData'] !== 'string') {
        entity.attributes['certificateInfoData'] = JSON.stringify(entity.attributes['certificateInfoData']);
      }
    }
    if (entity.attributes['guaranteeBinding']) {
      if (typeof entity.attributes['guaranteeBinding'] !== 'string') {
        entity.attributes['guaranteeBinding'] = JSON.stringify(entity.attributes['guaranteeBinding']);
      }
    }
    if (entity.attributes['bindingValueNote']) {
      if (typeof entity.attributes['bindingValueNote'] !== 'string') {
        entity.attributes['bindingValueNote'] = JSON.stringify(entity.attributes['bindingValueNote']);
      }
    }
    if (entity.prospectPerson) {
      entity.prospectPerson.dob = new Date(entity.prospectPerson.dob);
    }

    if (entity.prospectOrganization) {
      console.log('xxx');
    }
  }

  public findByCif(cif: string): Observable<HttpResponse<ICreditAgreement>> {
    return this.http.get<ICreditAgreement>(this.resourceUrl + '/cif/' + cif, { observe: 'response' });
  }

  public findPersonTemplate(cif: string): Observable<HttpResponse<ICreditAgreement>> {
    return this.http.get<ICreditAgreement>(this.resourceUrl + '/cif-person-template/' + cif, { observe: 'response' });
  }

  public findPartyGroupTemplate(cif: string): Observable<HttpResponse<ICreditAgreement>> {
    return this.http.get<ICreditAgreement>(this.resourceUrl + '/cif-organization-template/' + cif, { observe: 'response' });
  }

  public sendNotification(idApp: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl + '/send-notification-dar/' + idApp, { observe: 'response' });
  }

  public getStatus(path: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '/lov/' + path, { observe: 'response' });
  }

  public getCurrency(idUomFrom: string, idUomTo: string, effDate: string): Observable<HttpResponse<any[]>> {
    const params = new HttpParams().set('idUomFrom', idUomFrom).set('idUomTo', 'IDR').set('effDate', effDate);

    return this.http.get<any[]>(this.resourceCurrency + '/filterBy?', { params, observe: 'response' });
  }

  public retriveClausalAgreementData(id?: number, req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + `/api/agreement-clausals/agreement/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  public getRetriveData(cif: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceRetrive + '/find-fin-analysis/' + cif, { observe: 'response' });
  }

  public clausalAgreementsId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${MICROSERVICENAME.LOS}/api/agreement-clausals/${id}`, { observe: 'response' });
  }

  public getListRetrive(cif?: string, req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    const url = this.resouceGridRetrive + cif;
    return this.http
      .get<ICreditAgreement[]>(url, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditAgreement[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditAgreement[]>) => this.preLoadItemArray(res)));
  }

  public getListCurency(page: number, size: number): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.resourcelistCurrency + '/uoms', { params, observe: 'response' });
  }

  public getClausalParameterAll(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + `/api/agreement-clausal-parameters`, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  public getAddendumActive(category: string, req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + `/api/agreement-clausal-parameters/category/${category}/status/ACTIVE`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  public getActiveClausalById(id: number, statusCode: string, req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + `/api/agreement-clausals/addendum/application/${id}/status/${statusCode}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  public agreementClausalTemplate(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${MICROSERVICENAME.LOS}/api/agreement-clausals/template/agreement/${id}`, { observe: 'response' });
  }

  public agreementsClausalByPartyId(idParty: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${MICROSERVICENAME.LOS}/api/agreement-clausals/active-clausals/party/${idParty}`, { observe: 'response' });
  }

  public agreementsAddendumApplication(idApplication: number, req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(MICROSERVICENAME.LOS + `/api/agreement-clausals/addendum/application/${idApplication}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: HttpResponse<any[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any[]>) => this.preLoadItemArray(res)));
  }

  public saveClausalAgreementGroub(entity: any, params?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(params);
    return this.http
      .post<any>(MICROSERVICENAME.LOS + `/api/agreement-clausals/create/group`, entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  deleteClausalAgreement(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${MICROSERVICENAME.LOS}/api/agreement-clausals/${id}`, { observe: 'response' });
  }

  public saveClausalAgreement(entity: any, params?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(params);
    return this.http
      .post<any>(MICROSERVICENAME.LOS + `/api/agreement-clausals`, entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  public updateClausalAgreement(entity: any, params?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(params);
    return this.http
      .put<any>(MICROSERVICENAME.LOS + `/api/agreement-clausals`, entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
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
}

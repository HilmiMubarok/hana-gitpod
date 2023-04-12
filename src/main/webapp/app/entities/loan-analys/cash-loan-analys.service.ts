import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { map, tap } from 'rxjs/operators';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class CashLoanAnalysService extends AbstractEntityService<ICreditProposal> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api');
  }

  protected isNew(entity: ICreditProposal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  loanAnalisysDistribution(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/distribution', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisys(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-analyst', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysSMECRC(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-sme-crc', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysApproval(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-approval', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysInquiry(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-approval-inquiry', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysDarfinal(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-dar-final', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysDarChecker(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-dar-checker', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysDarLoanKomiteApproval(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/loan-committee-approval', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysDarNotif(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/la-dar-notif', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysCCDistribution(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/cc-distribution', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysCCChecking(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/cc-checking', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysCCInquiry(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/cc-inquiry', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  loanAnalisysCCRevew(req?: any): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditProposal[]>(this.resourceUrl + '/cash-loan-analisys/cc-review', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
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

  protected convertDateArrayFromServer(res: HttpResponse<ICreditProposal[]>): HttpResponse<ICreditProposal[]> {
    res.body.forEach((creditProposal: ICreditProposal) => {
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

  protected preSave(entity: ICreditProposal) {
    if (entity.prospectPerson) {
      entity.prospectPerson.dob = new Date(entity.prospectPerson.dob);
    }

    if (entity.prospectOrganization) {
      console.log('xxx');
    }
  }

  public queryByMenu(req?: any, menu?: string): Observable<HttpResponse<ICreditProposal[]>> {
    const options = createRequestOption(req);
    const url = this.loanAnalysisPath + '/' + menu;
    return this.http
      .get<ICreditProposal[]>(url, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoadItemArray(res)));
  }

  public findByCif(cif: string): Observable<HttpResponse<ICreditProposal>> {
    return this.http.get<ICreditProposal>(this.resourceUrl + '/cif/' + cif, { observe: 'response' });
  }

  public findPersonTemplate(cif: string): Observable<HttpResponse<ICreditProposal>> {
    return this.http.get<ICreditProposal>(this.resourceUrl + '/cif-person-template/' + cif, { observe: 'response' });
  }

  public findPartyGroupTemplate(cif: string): Observable<HttpResponse<ICreditProposal>> {
    return this.http.get<ICreditProposal>(this.resourceUrl + '/cif-organization-template/' + cif, { observe: 'response' });
  }

  public getStatus(path: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl + '/lov/la/' + path, { observe: 'response' });
  }

  public getLaDarCheckerNotif(cifId: string, param): Observable<HttpResponse<ICreditProposal[]>> {
    return this.http.get<ICreditProposal[]>(this.loanAnalysisPath + '/la-dar-checker-notif/' + cifId, {
      params: param,
      observe: 'response',
    });
  }

  public getAprovalLevel(idApplication: any): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('idApplication', idApplication);
    return this.http.get<any>(`${this.resourceSyncHobis}/filterBy?`, { params, observe: 'response' });
  }
}

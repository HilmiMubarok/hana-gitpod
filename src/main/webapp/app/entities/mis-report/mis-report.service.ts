import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class MisReportService {
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) { }

  public loadingGenerateDocument: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public generateDocumentLabel: BehaviorSubject<string> = new BehaviorSubject<string>('Generate Document');

  public loadingGenerateDocument$ = this.loadingGenerateDocument.asObservable();
  public generateDocumentLabel$ = this.generateDocumentLabel.asObservable();

  public setLoading(loading: boolean): void {
    this.loadingGenerateDocument.next(loading);
    this.generateDocumentLabel.next(loading ? 'Generating Document...' : 'Generate Document');
  }

  public getMisReportCPCredam(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/cp-credam/`, params, {
      observe: 'response',
    });
  }
  public getMisReportCP(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/credit-proposal/`,
      params,
      { observe: 'response' }
    );
  }

  public getMisReportCPFacility(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/credit-proposal-detail-facility/`,
      params,
      { observe: 'response' }
    );
  }

  public getMISReportAppraisal(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/appraisal/`, params, {
      observe: 'response',
    });
  }

  public getMISReportCPCredam(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/cp-credam/`, params, {
      observe: 'response',
    });
  }

  private readonly cache: Map<string, Observable<string[]>> =
    new Map<string, Observable<string[]>>();

  public getStatuses(appMenuId: string) {
    const params = new HttpParams().set('appMenuId', appMenuId).set('page', 0).set('sort', 'id,asc');
    const key = `statuses-${appMenuId}`;
    if (!this.cache[key]) {
      this.cache[key] = this.http.get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-status-item') + '/filterBy', {
        params,
        observe: 'response',
      }).pipe(
        map(res => res.body),
        shareReplay(1)
      )
      setTimeout(() => {
        delete this.cache[key];
      }, 6000);
    }

    return this.cache[key];

  }

  public getLovUsername(positionTypeId) {
    const params = new HttpParams().set('positionTypeIds', positionTypeId);

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/mis/get-persons'), {
        params,
        observe: 'response',
      })
      .pipe(map(res => res.body));
  }

  public getOfficerSurveyors() {
    const params = new HttpParams().set('page', 0).set('size', 99999).set('sort', 'id,asc');

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/positions'), {
        params,
        observe: 'response',
      })
      .pipe(
        map(res => res.body),
        map(employees => employees.filter((employee: any) => employee.positionTypeId === 'SURVEYOR' && employee.statusId === 'ACTIVE'))
      );
  }

  public getBranches() {
    const params = new HttpParams().set('page', 0).set('size', 99999).set('sort', 'id,asc');

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/internals'), {
        params,
        observe: 'response',
      })
      .pipe(map(res => res.body));
  }

  public getGeoBoundaries() {
    const params = new HttpParams().set('page', 0).set('size', 99999).set('sort', 'id,asc').set('idBoundaryType', 112);

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/geo-boundaries/filterBy'), {
        params,
        observe: 'response',
      })
      .pipe(
        map(res => res.body),
        map(boundaries => boundaries.filter((boundary: any) => boundary.boundaryTypeId === '112'))
      );
  }

  public searchCP(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(
      this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api') + '/_search/cash-credit-proposals',
      { params: options, observe: 'response' }
    );
  }

  public searchAppraisalBSU(req?: any): Observable<HttpResponse<any[]>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(
      this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api') + '/_search/cash-survey-appraisals',
      { params: options, observe: 'response' }
    );
  }
  public getLovUsernameDppk() {
    const params = new HttpParams().set('page', 0).set('size', 99999).set('sort', 'id,asc');

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/positions'), {
        params,
        observe: 'response',
      })
      .pipe(
        map(res => res.body),
        map(employees => employees.filter((employee: any) => employee.positionTypeId === 'CREDIT_ADMIN' && employee.statusId === 'ACTIVE'))
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRequestSlik } from './request-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { PartyCifService } from '../party-cif/party-cif.service';

@Injectable({ providedIn: 'root' })
export class RequestSlikService extends AbstractEntityService<any> {
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService
  ) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
  }

  protected isNew(entity: IRequestSlik): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public getAll(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl, { observe: 'response' });
  }

  public getData(): Observable<any> {
    return this.http.get<any>(this.resourceUrl, { observe: 'response' }).pipe(
      switchMap(data => {
        const requests = data.body.data.map((item: { cif: string }) => this.partyCifService.findCif(item.cif));
        return forkJoin([...requests]).pipe(
          map(details =>
            data.body.data.map((user, i) => ({
              ...user,
              customerName: details[i].body.customer.name,
              customerType: details[i].body.customer.customerType,
            }))
          )
        );
      })
    );
  }

  public searchByStatus(status: string) {
    const options = new HttpParams().set('status', status);
    return this.http.get<any>(this.resourceUrl + '/bystatus', { observe: 'response', params: options }).pipe(map(res => res.body.data));
  }

  public searchByCif(cif: number) {
    const options = new HttpParams().set('cif', cif);
    return this.http.get<any>(this.resourceUrl + '/bycif', { observe: 'response', params: options }).pipe(map(res => res.body.data));
  }

  public getStatuses() {
    return this.http.get<any>(this.resourceUrl + '/status', { observe: 'response' }).pipe(map(res => res.body.data));
  }

  public getDetail(id: number): Observable<any> {
    const options = new HttpParams().set('id', id);
    return this.http.get<any>(this.resourceUrl + '/byid', { observe: 'response', params: options }).pipe(
      switchMap(data =>
        forkJoin(this.partyCifService.findCif(data.body.data.cif)).pipe(
          map(detail => ({
            slik: data.body.data,
            partyCif: detail[0].body,
          }))
        )
      )
    );
  }

  public onSubmit(id: number, body: any): Observable<any> {
    return this.http.put<any>(this.resourceUrl + '/status/' + id, body);
  }

  // public createReqSlik(req): Observable<HttpResponse<any>> {
  //   const options = createRequestOption(req);

  //   return this.http.post<any>(this.resourceUrl, { params: options, observe: 'response' });
  // }

  protected preSave(entity: IRequestSlik) {}
}

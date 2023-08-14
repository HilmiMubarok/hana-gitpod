import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { InternalService } from 'app/entities/internal/internal.service';
import { MessageService } from 'primeng/api';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, delay, forkJoin, map, of, retryWhen, switchMap, take } from 'rxjs';
import _ from 'lodash';
import { RequestSlikStatus } from '../enums/request-slik-status.enum';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikBucketService extends AbstractEntityService<any> {
  reqSlikStatus = RequestSlikStatus;
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService,
    protected partySlikService: PartySlikService,
    protected internalService: InternalService,
    protected messageService: MessageService
  ) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik');
  }

  getAllData(page: number, size: number, sort: string, idPosition): Observable<any> {
    const options = new HttpParams().set('page', page).set('size', size).set('sort', sort).set('idPosition', idPosition);

    return this.http.get<any>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
      switchMap(data => {
        if (data.body.data.content.length === 0) {
          return of([]);
        }
        const requests = data.body.data.content.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return (
          forkJoin(requests)
            .pipe(
              map(details =>
                data.body.data.content.map((user, i) => ({
                  ...user,
                  internalId: details[i].body.internalId,
                  customerName: details[i].body.name,
                  segment: 'loading...',
                  dataExpand:
                    details[i].body.customerType === 'CORPORATE'
                      ? [details[i].body.customerOrganization]
                      : [details[i].body.customerPerson],
                  customerType: details[i].body.customerType,
                }))
              )
            )
            // Add data outside for pagination
            .pipe(
              map(final => ({
                data: [...final],
                pageable: {
                  totalElements: data.body.data.totalElements,
                  totalPages: data.body.data.totalPages,
                  pageable: data.body.data.pageable,
                },
              }))
            )
        );
      }),
      retryWhen(errors => errors.pipe(delay(1000), take(3)))
    );
  }

  searchRequestSlik(query: number | string, page: number): Observable<any> {
    const options = new HttpParams().set('query', query).set('page', page).set('size', 10).set('sort', 'dateCreate,desc');
    return this.http.get<any>(this.resourceUrl + '/byall', { observe: 'response', params: options }).pipe(
      switchMap(data => {
        if (data.body.data.content.length === 0) {
          return of([]);
        }
        const requests = data.body.data.content.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return (
          forkJoin(requests)
            .pipe(
              map(details =>
                data.body.data.content.map((user, i) => ({
                  ...user,
                  internalId: details[i].body.internalId,
                  customerName: details[i].body.name,
                  segment: 'loading...',
                  dataExpand:
                    details[i].body.customerType === 'CORPORATE'
                      ? [details[i].body.customerOrganization]
                      : [details[i].body.customerPerson],
                  customerType: details[i].body.customerType,
                }))
              )
            )
            // Add data outside for pagination
            .pipe(
              map(final => ({
                data: [...final],
                pageable: {
                  totalElements: data.body.data.totalElements,
                  totalPages: data.body.data.totalPages,
                  pageable: data.body.data.pageable,
                },
              }))
            )
        );
      })
    );
  }

  searchRequestSlikByStatus(status: string): Observable<any> {
    const options = { params: new HttpParams().set('status', status) };
    return this.http.get<any>(`${this.resourceUrl}/bystatus`, options).pipe(
      switchMap(data => {
        if (data.data.content.length === 0) {
          return of([]);
        }
        const requests = data.data.content.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return (
          forkJoin(requests)
            .pipe(
              map(details =>
                data.data.content.map((user, i) => ({
                  ...user,
                  internalId: details[i].body.internalId,
                  customerName: details[i].body.name,
                  segment: 'loading...',
                  dataExpand:
                    details[i].body.customerType === 'CORPORATE'
                      ? [details[i].body.customerOrganization]
                      : [details[i].body.customerPerson],
                  customerType: details[i].body.customerType,
                }))
              )
            )
            // Add data outside for pagination
            .pipe(
              map(final => ({
                data: [...final],
                pageable: {
                  totalElements: data.data.totalElements,
                  totalPages: data.data.totalPages,
                  pageable: data.data.pageable,
                },
              }))
            )
        );
      })
    );
  }
}

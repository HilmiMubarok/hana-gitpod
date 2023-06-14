import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { InternalService } from 'app/entities/internal/internal.service';
import { MessageService } from 'primeng/api';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
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

  getAllData(page: number, size: number, sort: string): Observable<any> {
    const options = new HttpParams().set('page', page).set('size', size).set('sort', sort);

    return this.http.get<any>(this.resourceUrl, { params: options, observe: 'response' }).pipe(
      switchMap(data => {
        console.log('BUCKET DATA', data.body.data.content);
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
        console.log('ddd', data.data.content);
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

  displayStatusLabel(dataSource) {
    const modifiedData = _.map(dataSource, obj => {
      if (obj.status === this.reqSlikStatus.DRAFT) {
        return { ...obj, status: 'Draft' };
      } else if (obj.status === this.reqSlikStatus.APPROVAL_BU) {
        return { ...obj, status: 'Approval SLIK By BU' };
      } else if (obj.status === this.reqSlikStatus.APPROVAL_SLIK) {
        return { ...obj, status: 'Approval SLIK By Team SLIK' };
      } else if (obj.status === this.reqSlikStatus.CHECKING) {
        return { ...obj, status: 'Checking In Progress' };
      } else if (obj.status === this.reqSlikStatus.RETURN_TO_RM) {
        return { ...obj, status: 'Return To RM' };
      } else if (obj.status === this.reqSlikStatus.VERIFY) {
        return { ...obj, status: 'Verify' };
      } else if (obj.status === this.reqSlikStatus.COMPLETE) {
        return { ...obj, status: 'Complete' };
      } else if (obj.status === this.reqSlikStatus.CANCEL) {
        return { ...obj, status: 'Cancel' };
      }
      return obj;
    });
    return modifiedData;
  }
}

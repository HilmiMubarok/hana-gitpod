import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRequestSlik } from './request-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { PartyCifService } from '../party-cif/party-cif.service';
import _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class RequestSlikService extends AbstractEntityService<any> {
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService
  ) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik');
  }

  protected isNew(entity: IRequestSlik): boolean {
    return entity.id === undefined || entity.id === null;
  }

  // Get Data with server side pagination
  getDataServerSidePagination(page: number, size: number, sort: string): Observable<any> {
    const url = `?page=${page}&size=${size}&sort=${sort}`;
    // return this.http.get(url).pipe(map((response: any) => response.data));
    return this.http.get<any>(this.resourceUrl + url, { observe: 'response' }).pipe(
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

  public filterData(data, checklists, type) {
    return new Promise((resolve, reject) => {
      data.body.forEach(res => {
        if (!this.isDetailChecked(res, checklists, type)) {
          data.body = data.body.filter(item => item.id !== res.id);
        }
        resolve(data);
      });
    });
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
    return this.http.get<any>(this.resourceUrl + '/bystatus', { observe: 'response', params: options }).pipe(
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
    // return this.http.get<any>(this.resourceUrl + '/bystatus', { observe: 'response', params: options }).pipe(map(res => res.body.data));
  }

  public searchByCif(cif: number) {
    const options = new HttpParams().set('cif', cif);

    return this.http.get<any>(this.resourceUrl + '/bycif', { observe: 'response', params: options }).pipe(
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
    // return this.http.get<any>(this.resourceUrl + '/bycif', { observe: 'response', params: options }).pipe(map(res => res.body.data));
  }

  public getStatuses() {
    return this.http.get<any>(this.resourceUrl + '/status', { observe: 'response' }).pipe(map(res => res.body.data));
  }

  public getDetailsByRequestSlikId(id: number): Observable<any> {
    const options = new HttpParams().set('id', id);
    return this.http
      .get<any>(this.resourceUrl + '/details/byrequestslikid', { observe: 'response', params: options })
      .pipe(map(res => res.body.data));
  }

  public getDetail(id: number): Observable<any> {
    const options = new HttpParams().set('id', id);
    return this.http.get<any>(this.resourceUrl + '/byid', { observe: 'response', params: options }).pipe(
      switchMap(data =>
        forkJoin(this.partyCifService.findCif(data.body.data.cif), this.getDetailsByRequestSlikId(id)).pipe(
          map(detail => ({
            slik: data.body.data,
            partyCif: detail[0].body,
            details: detail[1],
          }))
        )
      )
    );
  }

  public isDetailChecked(row, details, type) {
    if (type === 'shareholder') {
      if (row.person !== null) {
        const find = _.find(details, { idParty: row.person.id });
        if (find) {
          return true;
        } else {
          return false;
        }
      } else {
        const find = _.find(details, { idParty: row.shareHolderOrg.id });
        if (find) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      const find = _.find(details, { idParty: row.person.id });
      if (find) {
        return true;
      } else {
        return false;
      }
    }
  }

  public saveDetails(data: object[]) {
    return this.http.post<object[]>(this.resourceUrl + '/details/all', data, { observe: 'response' }).pipe(map(res => res.body));
  }

  postCBAS(cbasData) {
    const data = {
      id: 0,
      partyId: cbasData.partyId,
      requestReffId: '',
      requestSlikId: cbasData.id,
      status: 1,
    };
    const postCbas = this.http.post(this.resourceUrlNew, data, { observe: 'response' });
    const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + cbasData.id, { status: cbasData.status });

    return forkJoin([postCbas, changeStatus]);
  }

  submitDraft(data) {
    const save = this.http.post<object[]>(this.resourceUrl + '/details/all', data.checklists, { observe: 'response' });
    const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    return forkJoin([save, changeStatus]);
  }

  public onSubmit(data) {
    if (data.status === 'Checking') {
      return this.postCBAS(data);
    } else if (data.status === 'ApprovalSlik') {
      return this.submitDraft(data);
    } else {
      return this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
      // this.saveDetails(data.details)
      //   .toPromise()
      //   .then(() => this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status }));
      // return this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    }
  }

  parseSlikResult(data) {
    // Clone the input array to avoid modifying the original array
    const outputArr = [...data];

    // Loop through each object in the input array
    outputArr.forEach(obj => {
      // Check if the object has a 'resultJson' property
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty('resultJson')) {
        try {
          // Parse the 'resultJson' property value into a JavaScript object
          const parsedResultJson = JSON.parse(obj.resultJson);
          // Update the 'resultJson' property with the parsed value
          obj.resultJson = parsedResultJson;
        } catch (error) {
          console.error('Failed to parse resultJson:', error);
        }
      }
    });

    // Return the modified array with parsed 'resultJson' property values
    return outputArr;
  }

  getCbasResult(id, partyId) {
    const idParty = new HttpParams().set('idParty', partyId);
    const page = new HttpParams().set('page', 1);
    const size = new HttpParams().set('size', 10);
    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik/filterBy'), {
        params: idParty,
      })
      .pipe(map(res => res.data.content));
  }
  // public onSubmit(id: number, body: any) {
  //   if (body.status === 'Checking') {
  //     return this.postCBAS(id, body);
  //   } else {
  //     return this.http.put<any>(this.resourceUrl + '/status/' + id, body);
  //   }
  // }
  // public onSubmit(id: number, body: any): Observable<any> {
  //   return this.http.put<any>(this.resourceUrl + '/status/' + id, body);
  // }

  // public createReqSlik(req): Observable<HttpResponse<any>> {
  //   const options = createRequestOption(req);

  //   return this.http.post<any>(this.resourceUrl, { params: options, observe: 'response' });
  // }

  protected preSave(entity: IRequestSlik) {}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRequestSlik } from './request-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { BehaviorSubject, catchError, forkJoin, map, merge, mergeMap, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { PartyCifService } from '../party-cif/party-cif.service';
import _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { PartySlikService } from '../party-slik/party-slik.service';
import { StorageService } from '../storage/storage.service';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';
import lodash from 'lodash';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class RequestSlikService extends AbstractEntityService<any> {
  private bucket: string;
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService,
    protected partySlikService: PartySlikService,
    protected storageService: StorageService,
    protected internalService: InternalService,
    protected messageService: MessageService
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
    return this.http.get<any>(this.resourceUrl + url, { observe: 'response' }).pipe(
      switchMap(data => {
        console.log('BUCKET DATA', data.body.data);
        const requests = data.body.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return forkJoin([...requests]).pipe(
          map(details =>
            data.body.data.map((user, i) => ({
              ...user,
              internalId: details[i].body.internalId,
              customerName: details[i].body.name,
              segment: 'loading...',
              dataExpand:
                details[i].body.customerType === 'CORPORATE' ? [details[i].body.customerOrganization] : [details[i].body.customerPerson],
              customerType: details[i].body.customerType,
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
      });
      resolve(data);
    });
  }

  public getAll(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.resourceUrl, { observe: 'response' });
  }

  public getData(): Observable<any> {
    return this.http.get<any>(this.resourceUrl, { observe: 'response' }).pipe(
      switchMap(data => {
        const requests = data.body.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return forkJoin([...requests]).pipe(
          map(details => {
            console.log('DETAILS', details);
            data.body.data.map((user, i) => ({
              ...user,
              customerName: details[i].body.name,
              customerType: details[i].body.customerType,
            }));
          })
        );
      })
    );
  }

  public searchByStatus(status: string) {
    const options = { params: new HttpParams().set('status', status) };
    return this.http.get<any>(`${this.resourceUrl}/bystatus`, options).pipe(
      switchMap(data => {
        console.log('resposnd', { data });
        if (data.data.length === 0) {
          return of([]);
        }
        const requests = data.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return forkJoin([...requests]).pipe(
          map(details =>
            data.data.map((user, i) => ({
              ...user,
              internalId: details[i].body.internalId,
              customerName: details[i].body.name,
              segment: 'loading...',
              customerType: details[i].body.customerType,
            }))
          )
        );
      })
    );
  }

  public searchByCif(cif: number) {
    const options = new HttpParams().set('cif', cif);

    return this.http.get<any>(this.resourceUrl + '/bycif', { observe: 'response', params: options }).pipe(
      switchMap(data => {
        const requests = data.body.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return forkJoin([...requests]).pipe(
          map(details =>
            data.body.data.map((user, i) => ({
              ...user,
              customerName: details[i].body.name,
              customerType: details[i].body.customerType,
            }))
          )
        );
      })
    );
  }

  // Udah dipindah ke status service
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
        forkJoin(this.partyCifService.findCifCash(data.body.data.cif), this.getDetailsByRequestSlikId(id)).pipe(
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
    } else if (type === 'debitur') {
      const find = _.find(details, { idParty: row });
      if (find) {
        return true;
      } else {
        return false;
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
    // console.log('CBAS DATA', cbasData);
    const data = {
      id: 0,
      partyId: cbasData.partyId,
      requestSlikId: cbasData.id,
      status: 1,
    };
    const postOcr = this.http.post(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/slik/request'), cbasData.ocr, {
      observe: 'response',
    });
    const postCbas = this.http.post(this.resourceUrlNew, data, { observe: 'response' });
    const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + cbasData.id, { status: cbasData.status });
    return forkJoin([postOcr, changeStatus]);
  }

  submitDraft(data) {
    // console.log(data);
    // return new Observable();

    const save = this.http.post<object[]>(this.resourceUrl + '/details/all', data.checklists, { observe: 'response' });
    const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    return data.isSaved === true ? forkJoin([changeStatus]) : forkJoin([save, changeStatus]);
  }

  pushPartySlik(data) {
    console.log(data.verifyData);
    // copas slik file from cbas to $party_id
    const push = data.verifyData.map(res => this.CopasSlikFile(res.partyId, res.attributes['reqReffId'], `party_slik/cbas`, `party_slik`));
    // return new Observable();

    // Remove reqReffId attributes on this.verifyData
    console.log('Elemeeeeeen push party slik data', data);
    // data.verifyData = data.verifyData.map(res => {
    //   delete res.attributes['reqReffId'];
    //   return res;
    // });

    // const copyVerifyData = lodash.cloneDeep(data.verifyData);

    // copyVerifyData.map(res => {
    //   console.log('test', res);

    //   res.forEach(element => {
    //     // add attributes key to res
    //     console.log('res inside', res);
    //     element.attributes = element.attributes || [];
    //     element.attributes['partySlikCollaterals'] = element.partySlikCollaterals;

    //     delete element.partySlikCollaterals;

    //     element.partyId = copyVerifyData[0].partyId;
    //   });

    //   return res[0];
    // });

    // console.log('Elemeeeeeen push party slik test', copyVerifyData);
    console.log('Elemeeeeeen push party slik', data.verifyData);
    // return new Observable();
    const save = this.partySlikService.saveAll(data.verifyData);
    const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    return forkJoin([save, changeStatus, push]);
  }

  public onSubmit(data) {
    if (data.status === 'CHECKING') {
      // return this.postCBAS(data);
      return this.changeStatusAndRequest(data);
    } else if (data.status === 'APPROVAL_SLIK') {
      return this.submitDraft(data);
    } else if (data.status === 'COMPLETE') {
      return this.pushPartySlik(data);
    } else {
      return this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    }
  }

  CopasSlikFile(partyId, reqReffId, source, target) {
    // Get Bucket
    reqReffId = JSON.parse(reqReffId);
    console.log('reqreffid', reqReffId);
    // return new Observable();
    return this.storageService.getBucketName().subscribe(bucket => {
      const bucketName = bucket.body['bucket'];
      // Get Objects
      const predicate: Object = {
        key: `${source}/${reqReffId}`,
      };
      this.storageService.getObjects(bucketName, predicate).subscribe(objects => {
        console.log('OBJECTS', objects);

        // convert object to file
        objects.body.forEach(element => {
          // Fetch the file from the URL and create a new File object
          fetch(element['url'])
            .then(response => response.blob())
            .then(blob => {
              const file = new File([blob], element['name'], { type: element['metaData']['Value'], lastModified: element['lastModified'] });

              const formData = new FormData();
              formData.append('file', file);

              this.storageService
                .uploadMeta(bucketName, formData, {
                  objectName: `${target}/${partyId}/${element['name']}`,
                })
                .subscribe(uploadFile => {
                  console.log('UPLOAD FILE', uploadFile);
                });
            })
            .catch(error => {
              console.error('Error fetching the file:', error);
            });
        });
      });
    });
  }

  // public changeStatusAndRequest(cbasData: any): Observable<any> {
  //   return this.http
  //     .post(`${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR)}/api/slik/request`, cbasData.ocr, {
  //       observe: 'response',
  //     })
  //     .pipe(switchMap(() => this.http.put<any>(`${this.resourceUrl}/status/${cbasData.id}`, { status: 'CHECKING' })));
  //     // .pipe(switchMap(() => this.http.put<any>(`${this.resourceUrl}/status/${cbasData.id}`, { status: cbasData.status })));
  // }

  public changeStatusAndRequest(cbasData: any): Observable<any> {
    console.log('new OCR changestatusandrequest', cbasData.ocr);
    // return new Observable();

    const ocrRequests = cbasData.ocr.map((ocrItem: any) =>
      this.http
        .post(`${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR)}/api/slik/request`, ocrItem, {
          observe: 'response',
        })
        .pipe(
          // eslint-disable-next-line arrow-body-style
          catchError(error => {
            // Handle error for each post request
            // ===
            // const resError = JSON.parse(error.error.text + `"}`);
            // console.log('REESSERR', resError);
            // console.error('Post Request Error:', { error, ocrItem, flag: JSON.parse(error.error.text + `"}`) });
            // resError.ResultFlag === 'false'
            //   ? this.messageService.add({
            //       severity: 'error',
            //       summary: 'Error',
            //       detail: ocrItem.name + ' Failed Request. ' + resError.ErrorMsg,
            //       life: 15000,
            //     })
            //   : this.messageService.add({
            //       severity: 'success',
            //       summary: 'Success',
            //       detail: ocrItem.name + ' Request Success',
            //       life: 15000,
            //     });
            // === //
            // Show error notification
            return of(null); // Continue the loop even if there's an error
          })
        )
    );

    return forkJoin(ocrRequests).pipe(
      mergeMap(() =>
        // Success notification after all post requests are completed
        // Show success notification

        this.http.put<any>(`${this.resourceUrl}/status/${cbasData.id}`, { status: cbasData.status }).pipe(
          catchError(error => {
            // Handle error for put request
            console.error('Put Request Error:', error);
            // Show error notification
            return throwError(error);
          })
        )
      )
    );

    /**
     * ocr.name
     * ocr.npwp
     */
    // const ocrRequests = cbasData.ocr.map((ocrItem: any) =>
    //   this.http.post(`${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR)}/api/slik/request`, ocrItem, {
    //     observe: 'response',
    //   })
    // );

    // return forkJoin(ocrRequests).pipe(
    //   switchMap(() => this.http.put<any>(`${this.resourceUrl}/status/${cbasData.id}`, { status: cbasData.status }))
    // );
  }

  mapSlikResult(data) {
    console.log('data ori', {
      data,
      typeResult: typeof data.resultJson,
    });

    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty('resultJson')) {
      try {
        // Parse the 'resultJson' property value into a JavaScript object
        const parsedResultJson = JSON.parse(data.resultJson);
        // Update the 'resultJson' property with the parsed value
        data.resultJson = parsedResultJson;
      } catch (error) {
        console.error('Failed to test parse resultJson:', error);
      }
    }

    const finalData = [];

    data.resultJson.sliks.forEach(slik => {
      const { nikNpwp, ideb, partySlik } = slik;
      finalData.push(
        Object.assign({}, ideb.data.dataPokokDebitur[0], { requestReffId: data.resultJson.requestReffId, nikNpwp, partySlik })
      );
    });

    console.log('finalData', finalData);

    return finalData;
  }

  getCbasFilterBy(idCbasSlik) {
    const params = new HttpParams().set('idCbasSLik', idCbasSlik);
    return this.http.get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik_result/filterBy'), {
      observe: 'response',
      params,
    });
  }

  getCbasRes(id, partyId) {
    const params = new HttpParams().set('idParty', partyId).set('idRequestSLik', id);

    return this.http.get<any>(this.resourceUrlNew + '/getIdCbas', {
      observe: 'response',
      params,
    });
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

  getChecklistData(isByReqSlikId = false, reqslikId = null) {
    if (isByReqSlikId) {
      const params = new HttpParams().set('id', reqslikId);
      return this.http.get<any>(this.resourceUrl + '/details/byrequestslikid', {
        observe: 'response',
        params,
      });
    } else {
      const params = new HttpParams().set('page', 1).set('size', 99);
      return this.http.get<any>(this.resourceUrl + '/details', {
        observe: 'response',
        params,
      });
    }
  }

  // remove Checklist
  removeChecklist(data) {
    return this.http.delete<any>(this.resourceUrl + '/details/' + data, {
      observe: 'response',
    });
  }

  nikNpwp = new BehaviorSubject<string[]>([]);
  getNikNpwp() {
    return this.nikNpwp;
  }

  setNikNpwp(nikNpwp) {
    this.nikNpwp.next(nikNpwp);
  }

  protected preSave(entity: IRequestSlik) {}
}

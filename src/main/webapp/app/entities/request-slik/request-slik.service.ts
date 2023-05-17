import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IRequestSlik } from './request-slik.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { PartyCifService } from '../party-cif/party-cif.service';
import _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { PartySlikService } from '../party-slik/party-slik.service';
import { StorageService } from '../storage/storage.service';
import { IInternal } from '../internal/internal.model';
import { InternalService } from '../internal/internal.service';

@Injectable({ providedIn: 'root' })
export class RequestSlikService extends AbstractEntityService<any> {
  private bucket: string;
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService,
    protected partySlikService: PartySlikService,
    protected storageService: StorageService,
    protected internalService: InternalService
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
        console.log('BUCKET DATA', data.body.data);
        const requests = data.body.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        console.log('request', requests);
        return forkJoin([...requests]).pipe(
          map(details =>
            data.body.data.map((user, i) => ({
              ...user,
              customerName: details[i].body.name,
              // segment: this.loadInternalById(details[i].body.internalId)
              //   .then((res2: IInternal) => {
              //     if (res2.parentId) {
              //       this.rmBranch = res2;
              //       this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              //         this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
              //           if (res4.parentId) {
              //             this.rmRegional = res4;
              //             this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
              //               this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
              //                 this.rmSegment = res6.organizationName;
              //                 return res6.organizationName;
              //               });
              //             });
              //           }
              //         });
              //       });
              //     }
              //   })
              //   .finally(() => this.rmSegment),
              // segment: this.loadInternalInformationRM(details[i].body.internalId),
              // segment: details[i].body.internalId,
              customerType: details[i].body.customerType,
            }))
          )
        );
      })
    );
  }

  // getSegment = async (internalId: string) => {
  //   const internal = await this.loadInternalById(internalId);
  //   if (internal.parentId) {
  //     const branch = await this.loadBranch(internal.parentId.toString());
  //     if (branch !== null && (typeof branch?.parentId !== 'undefined' || branch?.parentId !== null)) {
  //       const regional = await this.loadInternalById(branch.parentId.toString());
  //       if (regional.parentId) {
  //         const segment = await this.loadInternalById(regional.parentId.toString());
  //         return segment.organizationName;
  //       }
  //     }
  //   }
  //   return null;
  // };
  // getSegment = async internalId => {
  //   const internal = await this.loadInternalById(internalId);
  //   if (internal.parentId) {
  //     const branch = this.loadBranch(internal.parentId.toString());
  //     if (branch!.parentId) {
  //       const regional = await this.loadInternalById(branch!.parentId.toString());
  //       if (regional.parentId) {
  //         const segment = await this.loadInternalById(regional.parentId.toString());
  //         return segment.organizationName;
  //       }
  //     }
  //   }
  //   return null;
  // };

  private loadInternalInformationRM(internalId): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.loadInternalById(internalId).then((res2: IInternal) => {
      if (res2.parentId) {
        this.rmBranch = res2;
        this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
          this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
            if (res4.parentId) {
              this.rmRegional = res4;
              this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                  this.rmSegment = res6.organizationName;
                  // return res6.organizationName;
                });
              });
            }
          });
        });
      }
    });
    // console.log('SAD', this.rmSegment);
    // return this.rmSegment;
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
    const options = new HttpParams().set('status', status);
    return this.http.get<any>(this.resourceUrl + '/bystatus', { observe: 'response', params: options }).pipe(
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
    // return this.http.get<any>(this.resourceUrl + '/bystatus', { observe: 'response', params: options }).pipe(map(res => res.body.data));
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

  pushPartySlik(data) {
    // copas slik file from cbas to $party_id
    const push = data.verifyData.map(res => this.CopasSlikFile(res.partyId, res.attributes['reqReffId'], `party_slik/cbas`, `party_slik`));

    // Remove reqReffId attributes on this.verifyData
    data.verifyData = data.verifyData.map(res => {
      delete res.attributes['reqReffId'];
      return res;
    });

    const save = this.partySlikService.saveAll(data.verifyData);
    const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    return forkJoin([save, changeStatus, push]);
    // return forkJoin([save, changeStatus, push]);
    // return this.partySlikService.saveAll(data.verifyData);
  }

  public onSubmit(data) {
    if (data.status === 'Checking') {
      return this.postCBAS(data);
    } else if (data.status === 'Approval') {
      return this.submitDraft(data);
    } else if (data.status === 'Complete') {
      // push partyslik data.verifyData
      return this.pushPartySlik(data);
      // const changeStatus = this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
      // return this.partySlikService.saveAll(data.verifyData);
    } else {
      return this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
      // this.saveDetails(data.details)
      //   .toPromise()
      //   .then(() => this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status }));
      // return this.http.put<any>(this.resourceUrl + '/status/' + data.id, { status: data.status });
    }
  }

  CopasSlikFile(partyId, reqReffId, source, target) {
    // Get Bucket
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

  mapSlikResult(data) {
    // console.log('data ori', {
    //   data,
    //   typeResult: typeof data.resultJson,
    // });
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
      finalData.push(Object.assign({}, ideb.data.dataPokokDebitur[0], { nikNpwp, partySlik: partySlik[0] }));
    });
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
    const params = new HttpParams().set('idParty', partyId).set('idRequestSLik', id).set('page', 1).set('size', 10);

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

  nikNpwp = new BehaviorSubject<string[]>([]);
  getNikNpwp() {
    return this.nikNpwp;
  }

  setNikNpwp(nikNpwp) {
    this.nikNpwp.next(nikNpwp);
  }

  protected preSave(entity: IRequestSlik) {}

  private loadInternalById(internalId: string): Promise<IInternal> {
    return new Promise<IInternal>((resolve, reject) => {
      this.internalService.find(internalId).subscribe(res => {
        if (res.body) {
          resolve(res.body);
        } else {
          resolve(null);
        }
      });
    });
  }

  private loadRegional(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.regionals = res.body;
        resolve();
      });
    });
  }

  // private loadBranch(value: string) {
  //   return this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 });
  // }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }

  branchs;
  segments;
  regionals;
  rmBranch;
  rmSegment;
  rmRegional;
}

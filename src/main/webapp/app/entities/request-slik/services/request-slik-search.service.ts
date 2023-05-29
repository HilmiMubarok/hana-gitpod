import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikSearchService extends AbstractEntityService<any> {
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService
  ) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik');
  }

  // public searchRequestSlik(data: number | string) {
  //   const options = new HttpParams().set('query', data).set('page', 0).set('size', 99);
  //   return this.http.get<any>(this.resourceUrl + '/byall', { observe: 'response', params: options }).pipe(
  //     switchMap(reqSlik => {
  //       const requests = reqSlik.body.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
  //       return forkJoin([...requests]).pipe(
  //         map(details =>
  //           reqSlik.body.data.map((user, i) => ({
  //             ...user,
  //             customerName: details[i].body.name,
  //             internalId: details[i].body.internalId,
  //             segment: 'loading...',
  //             customerType: details[i].body.customerType,
  //           }))
  //         )
  //       );
  //     })
  //   );
  // }
  public searchRequestSlik(query: number | string) {
    const options = new HttpParams().set('query', query).set('page', 0).set('size', 99);
    return this.http.get<any>(this.resourceUrl + '/byall', { observe: 'response', params: options }).pipe(
      switchMap(data => {
        console.log('resposnd', { data });
        if (data.body.data.length === 0) {
          return of([]);
        }
        const requests = data.body.data.map((item: { cif: string }) => this.partyCifService.findCifCash(item.cif));
        return forkJoin([...requests]).pipe(
          map(details =>
            data.body.data.map((user, i) => ({
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
              segment: 'loading...',
              customerType: details[i].body.customerType,
            }))
          )
        );
      })
    );
    // return this.http.get<any>(this.resourceUrl + '/bycif', { observe: 'response', params: options }).pipe(map(res => res.body.data));
  }
}

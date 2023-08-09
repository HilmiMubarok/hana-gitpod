import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikVerifyService extends AbstractEntityService<any> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/cbas_slik');
  }

  originalVerifyData = new BehaviorSubject<any>([]);
  originalVerifyData$ = this.originalVerifyData.asObservable();

  verifyChecklistsData = new BehaviorSubject<any>([]);
  verifyChecklistsData$ = this.verifyChecklistsData.asObservable();

  setVerifyChecklistsData(data: any) {
    this.verifyChecklistsData.next(data);
  }

  setOriginalVerifyData(data: any) {
    const currentData = this.originalVerifyData.getValue();
    currentData.push(data);
    this.originalVerifyData.next(currentData);
  }

  // isAllDataRetrievsed(id: number): boolean {
  //   const params = createRequestOption({
  //     idRequestSLik: id,
  //   });

  //   const req = this.http
  //     .get(this.resourceUrl + '/getResultSlik', { params })
  //     .pipe(map(res => res as IRetrieveConfirmation))
  //     .pipe(map(res => res.data));
  // }

  isAllDataRetrieved(id: number): Observable<boolean> {
    const params = createRequestOption({
      idRequestSLik: id,
    });

    return this.http.get<IRetrieveConfirmation>(this.resourceUrl + '/getResultSlik', { params }).pipe(
      map((response: IRetrieveConfirmation) => response.data),
      map(data => !!data)
    );
  }
}

export interface IRetrieveConfirmation {
  data: boolean;
}

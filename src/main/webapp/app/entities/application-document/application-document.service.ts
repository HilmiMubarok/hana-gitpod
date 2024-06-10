import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IApplicationDocument } from './application-document.model';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class ApplicationDocumentService extends AbstractEntityService<IApplicationDocument> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/application-documents');
  }

  protected isNew(entity: IApplicationDocument): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IApplicationDocument) {}

  public getListApplicationDocument(id?: number, req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    const url = this.resourceUrl + '/by-id/' + id + '/by-status?';
    return this.http
      .get<IApplicationDocument[]>(url, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<IApplicationDocument[]>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<IApplicationDocument[]>) => this.preLoadItemArray(res)));
  }

  // public update(entity: IApplicationDocument, params?: any): Observable<HttpResponse<any>> {
  //   const options = createRequestOption(params);
  //   const url = this.resourceUrl + '/list/';
  //   return this.http
  //     .put<IApplicationDocument>(this.resourceUrl, entity, { observe: 'response', params: options })
  //     .pipe(map((res: HttpResponse<IApplicationDocument>) => this.convertDateFromServer(res)))
  //     .pipe(map((res: HttpResponse<IApplicationDocument>) => this.preLoadItem(res)));
  // }

  // public getListApplicationDocument(id?: number, req?: any): Observable<HttpResponse<any>> {
  //   const options = createRequestOption(req);
  //   const url = this.resourceUrl + '/list/' + id;
  //   return this.http
  //     .get<IApplicationDocument[]>(url, { params: options, observe: 'response' })
  //     .pipe(map((res: HttpResponse<IApplicationDocument[]>) => this.convertDateArrayFromServer(res)))
  //     .pipe(map((res: HttpResponse<IApplicationDocument[]>) => this.preLoadItemArray(res)));
  // }
}

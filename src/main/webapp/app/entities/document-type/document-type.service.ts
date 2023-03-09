import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IDocumentType } from './document-type.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DocumentTypeService extends AbstractEntityService<IDocumentType> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    // this.resourceUrl = this.applicationConfigService.getEndpointFor('api/document-types');
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/document-types');
  }

  public filterTableData(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl + '/filterBy?', { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.convertDateArrayFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItemArray(res)));
  }

  public listDocumentType(parentId: string): Observable<HttpResponse<any>> {
    return this.http.get<any[]>(this.resourceUrl + '/list/' + parentId, { observe: 'response' });
  }

  protected isNew(entity: IDocumentType): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IDocumentType) {}
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICif, getCifIdentifier } from '../cif.model';

export type EntityResponseType = HttpResponse<ICif>;
export type EntityArrayResponseType = HttpResponse<ICif[]>;

@Injectable({ providedIn: 'root' })
export class CifService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cifs');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/cifs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cif: ICif): Observable<EntityResponseType> {
    return this.http.post<ICif>(this.resourceUrl, cif, { observe: 'response' });
  }

  update(cif: ICif): Observable<EntityResponseType> {
    return this.http.put<ICif>(`${this.resourceUrl}/${getCifIdentifier(cif) as number}`, cif, { observe: 'response' });
  }

  partialUpdate(cif: ICif): Observable<EntityResponseType> {
    return this.http.patch<ICif>(`${this.resourceUrl}/${getCifIdentifier(cif) as number}`, cif, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICif>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICif[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICif[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addCifToCollectionIfMissing(cifCollection: ICif[], ...cifsToCheck: (ICif | null | undefined)[]): ICif[] {
    const cifs: ICif[] = cifsToCheck.filter(isPresent);
    if (cifs.length > 0) {
      const cifCollectionIdentifiers = cifCollection.map(cifItem => getCifIdentifier(cifItem)!);
      const cifsToAdd = cifs.filter(cifItem => {
        const cifIdentifier = getCifIdentifier(cifItem);
        if (cifIdentifier == null || cifCollectionIdentifiers.includes(cifIdentifier)) {
          return false;
        }
        cifCollectionIdentifiers.push(cifIdentifier);
        return true;
      });
      return [...cifsToAdd, ...cifCollection];
    }
    return cifCollection;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPartyGroup, getPartyGroupIdentifier } from '../party-group.model';

export type EntityResponseType = HttpResponse<IPartyGroup>;
export type EntityArrayResponseType = HttpResponse<IPartyGroup[]>;

@Injectable({ providedIn: 'root' })
export class PartyGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/party-groups');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/party-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(partyGroup: IPartyGroup): Observable<EntityResponseType> {
    return this.http.post<IPartyGroup>(this.resourceUrl, partyGroup, { observe: 'response' });
  }

  update(partyGroup: IPartyGroup): Observable<EntityResponseType> {
    return this.http.put<IPartyGroup>(`${this.resourceUrl}/${getPartyGroupIdentifier(partyGroup) as number}`, partyGroup, {
      observe: 'response',
    });
  }

  partialUpdate(partyGroup: IPartyGroup): Observable<EntityResponseType> {
    return this.http.patch<IPartyGroup>(`${this.resourceUrl}/${getPartyGroupIdentifier(partyGroup) as number}`, partyGroup, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPartyGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPartyGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPartyGroup[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addPartyGroupToCollectionIfMissing(
    partyGroupCollection: IPartyGroup[],
    ...partyGroupsToCheck: (IPartyGroup | null | undefined)[]
  ): IPartyGroup[] {
    const partyGroups: IPartyGroup[] = partyGroupsToCheck.filter(isPresent);
    if (partyGroups.length > 0) {
      const partyGroupCollectionIdentifiers = partyGroupCollection.map(partyGroupItem => getPartyGroupIdentifier(partyGroupItem)!);
      const partyGroupsToAdd = partyGroups.filter(partyGroupItem => {
        const partyGroupIdentifier = getPartyGroupIdentifier(partyGroupItem);
        if (partyGroupIdentifier == null || partyGroupCollectionIdentifiers.includes(partyGroupIdentifier)) {
          return false;
        }
        partyGroupCollectionIdentifiers.push(partyGroupIdentifier);
        return true;
      });
      return [...partyGroupsToAdd, ...partyGroupCollection];
    }
    return partyGroupCollection;
  }
}

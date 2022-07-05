import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { ICustomerInfo, getCustomerInfoIdentifier } from '../customer-info.model';

export type EntityResponseType = HttpResponse<ICustomerInfo>;
export type EntityArrayResponseType = HttpResponse<ICustomerInfo[]>;

@Injectable({ providedIn: 'root' })
export class CustomerInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customer-infos');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/customer-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customerInfo: ICustomerInfo): Observable<EntityResponseType> {
    return this.http.post<ICustomerInfo>(this.resourceUrl, customerInfo, { observe: 'response' });
  }

  update(customerInfo: ICustomerInfo): Observable<EntityResponseType> {
    return this.http.put<ICustomerInfo>(`${this.resourceUrl}/${getCustomerInfoIdentifier(customerInfo) as number}`, customerInfo, {
      observe: 'response',
    });
  }

  partialUpdate(customerInfo: ICustomerInfo): Observable<EntityResponseType> {
    return this.http.patch<ICustomerInfo>(`${this.resourceUrl}/${getCustomerInfoIdentifier(customerInfo) as number}`, customerInfo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomerInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerInfo[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addCustomerInfoToCollectionIfMissing(
    customerInfoCollection: ICustomerInfo[],
    ...customerInfosToCheck: (ICustomerInfo | null | undefined)[]
  ): ICustomerInfo[] {
    const customerInfos: ICustomerInfo[] = customerInfosToCheck.filter(isPresent);
    if (customerInfos.length > 0) {
      const customerInfoCollectionIdentifiers = customerInfoCollection.map(
        customerInfoItem => getCustomerInfoIdentifier(customerInfoItem)!
      );
      const customerInfosToAdd = customerInfos.filter(customerInfoItem => {
        const customerInfoIdentifier = getCustomerInfoIdentifier(customerInfoItem);
        if (customerInfoIdentifier == null || customerInfoCollectionIdentifiers.includes(customerInfoIdentifier)) {
          return false;
        }
        customerInfoCollectionIdentifiers.push(customerInfoIdentifier);
        return true;
      });
      return [...customerInfosToAdd, ...customerInfoCollection];
    }
    return customerInfoCollection;
  }
}

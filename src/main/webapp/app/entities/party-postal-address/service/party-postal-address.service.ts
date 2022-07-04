import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPartyPostalAddress, getPartyPostalAddressIdentifier } from '../party-postal-address.model';

export type EntityResponseType = HttpResponse<IPartyPostalAddress>;
export type EntityArrayResponseType = HttpResponse<IPartyPostalAddress[]>;

@Injectable({ providedIn: 'root' })
export class PartyPostalAddressService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/party-postal-addresses');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/party-postal-addresses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(partyPostalAddress: IPartyPostalAddress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(partyPostalAddress);
    return this.http
      .post<IPartyPostalAddress>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(partyPostalAddress: IPartyPostalAddress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(partyPostalAddress);
    return this.http
      .put<IPartyPostalAddress>(`${this.resourceUrl}/${getPartyPostalAddressIdentifier(partyPostalAddress) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(partyPostalAddress: IPartyPostalAddress): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(partyPostalAddress);
    return this.http
      .patch<IPartyPostalAddress>(`${this.resourceUrl}/${getPartyPostalAddressIdentifier(partyPostalAddress) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPartyPostalAddress>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPartyPostalAddress[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPartyPostalAddress[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addPartyPostalAddressToCollectionIfMissing(
    partyPostalAddressCollection: IPartyPostalAddress[],
    ...partyPostalAddressesToCheck: (IPartyPostalAddress | null | undefined)[]
  ): IPartyPostalAddress[] {
    const partyPostalAddresses: IPartyPostalAddress[] = partyPostalAddressesToCheck.filter(isPresent);
    if (partyPostalAddresses.length > 0) {
      const partyPostalAddressCollectionIdentifiers = partyPostalAddressCollection.map(
        partyPostalAddressItem => getPartyPostalAddressIdentifier(partyPostalAddressItem)!
      );
      const partyPostalAddressesToAdd = partyPostalAddresses.filter(partyPostalAddressItem => {
        const partyPostalAddressIdentifier = getPartyPostalAddressIdentifier(partyPostalAddressItem);
        if (partyPostalAddressIdentifier == null || partyPostalAddressCollectionIdentifiers.includes(partyPostalAddressIdentifier)) {
          return false;
        }
        partyPostalAddressCollectionIdentifiers.push(partyPostalAddressIdentifier);
        return true;
      });
      return [...partyPostalAddressesToAdd, ...partyPostalAddressCollection];
    }
    return partyPostalAddressCollection;
  }

  protected convertDateFromClient(partyPostalAddress: IPartyPostalAddress): IPartyPostalAddress {
    return Object.assign({}, partyPostalAddress, {
      fromDate: partyPostalAddress.fromDate?.isValid() ? partyPostalAddress.fromDate.toJSON() : undefined,
      thruDate: partyPostalAddress.thruDate?.isValid() ? partyPostalAddress.thruDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fromDate = res.body.fromDate ? dayjs(res.body.fromDate) : undefined;
      res.body.thruDate = res.body.thruDate ? dayjs(res.body.thruDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((partyPostalAddress: IPartyPostalAddress) => {
        partyPostalAddress.fromDate = partyPostalAddress.fromDate ? dayjs(partyPostalAddress.fromDate) : undefined;
        partyPostalAddress.thruDate = partyPostalAddress.thruDate ? dayjs(partyPostalAddress.thruDate) : undefined;
      });
    }
    return res;
  }
}

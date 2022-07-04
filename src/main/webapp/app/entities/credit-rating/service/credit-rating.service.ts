import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICreditRating, getCreditRatingIdentifier } from '../credit-rating.model';

export type EntityResponseType = HttpResponse<ICreditRating>;
export type EntityArrayResponseType = HttpResponse<ICreditRating[]>;

@Injectable({ providedIn: 'root' })
export class CreditRatingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-ratings');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/credit-ratings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditRating: ICreditRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditRating);
    return this.http
      .post<ICreditRating>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(creditRating: ICreditRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditRating);
    return this.http
      .put<ICreditRating>(`${this.resourceUrl}/${getCreditRatingIdentifier(creditRating) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(creditRating: ICreditRating): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditRating);
    return this.http
      .patch<ICreditRating>(`${this.resourceUrl}/${getCreditRatingIdentifier(creditRating) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICreditRating>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditRating[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICreditRating[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addCreditRatingToCollectionIfMissing(
    creditRatingCollection: ICreditRating[],
    ...creditRatingsToCheck: (ICreditRating | null | undefined)[]
  ): ICreditRating[] {
    const creditRatings: ICreditRating[] = creditRatingsToCheck.filter(isPresent);
    if (creditRatings.length > 0) {
      const creditRatingCollectionIdentifiers = creditRatingCollection.map(
        creditRatingItem => getCreditRatingIdentifier(creditRatingItem)!
      );
      const creditRatingsToAdd = creditRatings.filter(creditRatingItem => {
        const creditRatingIdentifier = getCreditRatingIdentifier(creditRatingItem);
        if (creditRatingIdentifier == null || creditRatingCollectionIdentifiers.includes(creditRatingIdentifier)) {
          return false;
        }
        creditRatingCollectionIdentifiers.push(creditRatingIdentifier);
        return true;
      });
      return [...creditRatingsToAdd, ...creditRatingCollection];
    }
    return creditRatingCollection;
  }

  protected convertDateFromClient(creditRating: ICreditRating): ICreditRating {
    return Object.assign({}, creditRating, {
      fromDate: creditRating.fromDate?.isValid() ? creditRating.fromDate.toJSON() : undefined,
      thruDate: creditRating.thruDate?.isValid() ? creditRating.thruDate.toJSON() : undefined,
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
      res.body.forEach((creditRating: ICreditRating) => {
        creditRating.fromDate = creditRating.fromDate ? dayjs(creditRating.fromDate) : undefined;
        creditRating.thruDate = creditRating.thruDate ? dayjs(creditRating.thruDate) : undefined;
      });
    }
    return res;
  }
}

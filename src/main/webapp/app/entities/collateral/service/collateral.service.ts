import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICollateral, getCollateralIdentifier } from '../collateral.model';

export type EntityResponseType = HttpResponse<ICollateral>;
export type EntityArrayResponseType = HttpResponse<ICollateral[]>;

@Injectable({ providedIn: 'root' })
export class CollateralService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/collaterals');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/collaterals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(collateral: ICollateral): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collateral);
    return this.http
      .post<ICollateral>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(collateral: ICollateral): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collateral);
    return this.http
      .put<ICollateral>(`${this.resourceUrl}/${getCollateralIdentifier(collateral) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(collateral: ICollateral): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(collateral);
    return this.http
      .patch<ICollateral>(`${this.resourceUrl}/${getCollateralIdentifier(collateral) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICollateral>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICollateral[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICollateral[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addCollateralToCollectionIfMissing(
    collateralCollection: ICollateral[],
    ...collateralsToCheck: (ICollateral | null | undefined)[]
  ): ICollateral[] {
    const collaterals: ICollateral[] = collateralsToCheck.filter(isPresent);
    if (collaterals.length > 0) {
      const collateralCollectionIdentifiers = collateralCollection.map(collateralItem => getCollateralIdentifier(collateralItem)!);
      const collateralsToAdd = collaterals.filter(collateralItem => {
        const collateralIdentifier = getCollateralIdentifier(collateralItem);
        if (collateralIdentifier == null || collateralCollectionIdentifiers.includes(collateralIdentifier)) {
          return false;
        }
        collateralCollectionIdentifiers.push(collateralIdentifier);
        return true;
      });
      return [...collateralsToAdd, ...collateralCollection];
    }
    return collateralCollection;
  }

  protected convertDateFromClient(collateral: ICollateral): ICollateral {
    return Object.assign({}, collateral, {
      fromDate: collateral.fromDate?.isValid() ? collateral.fromDate.toJSON() : undefined,
      thruDate: collateral.thruDate?.isValid() ? collateral.thruDate.toJSON() : undefined,
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
      res.body.forEach((collateral: ICollateral) => {
        collateral.fromDate = collateral.fromDate ? dayjs(collateral.fromDate) : undefined;
        collateral.thruDate = collateral.thruDate ? dayjs(collateral.thruDate) : undefined;
      });
    }
    return res;
  }
}

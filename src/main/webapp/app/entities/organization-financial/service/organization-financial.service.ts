import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IOrganizationFinancial, getOrganizationFinancialIdentifier } from '../organization-financial.model';

export type EntityResponseType = HttpResponse<IOrganizationFinancial>;
export type EntityArrayResponseType = HttpResponse<IOrganizationFinancial[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationFinancialService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-financials');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/organization-financials');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationFinancial: IOrganizationFinancial): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationFinancial);
    return this.http
      .post<IOrganizationFinancial>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationFinancial: IOrganizationFinancial): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationFinancial);
    return this.http
      .put<IOrganizationFinancial>(`${this.resourceUrl}/${getOrganizationFinancialIdentifier(organizationFinancial) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationFinancial: IOrganizationFinancial): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationFinancial);
    return this.http
      .patch<IOrganizationFinancial>(`${this.resourceUrl}/${getOrganizationFinancialIdentifier(organizationFinancial) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationFinancial>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationFinancial[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationFinancial[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addOrganizationFinancialToCollectionIfMissing(
    organizationFinancialCollection: IOrganizationFinancial[],
    ...organizationFinancialsToCheck: (IOrganizationFinancial | null | undefined)[]
  ): IOrganizationFinancial[] {
    const organizationFinancials: IOrganizationFinancial[] = organizationFinancialsToCheck.filter(isPresent);
    if (organizationFinancials.length > 0) {
      const organizationFinancialCollectionIdentifiers = organizationFinancialCollection.map(
        organizationFinancialItem => getOrganizationFinancialIdentifier(organizationFinancialItem)!
      );
      const organizationFinancialsToAdd = organizationFinancials.filter(organizationFinancialItem => {
        const organizationFinancialIdentifier = getOrganizationFinancialIdentifier(organizationFinancialItem);
        if (
          organizationFinancialIdentifier == null ||
          organizationFinancialCollectionIdentifiers.includes(organizationFinancialIdentifier)
        ) {
          return false;
        }
        organizationFinancialCollectionIdentifiers.push(organizationFinancialIdentifier);
        return true;
      });
      return [...organizationFinancialsToAdd, ...organizationFinancialCollection];
    }
    return organizationFinancialCollection;
  }

  protected convertDateFromClient(organizationFinancial: IOrganizationFinancial): IOrganizationFinancial {
    return Object.assign({}, organizationFinancial, {
      fromDate: organizationFinancial.fromDate?.isValid() ? organizationFinancial.fromDate.toJSON() : undefined,
      thruDate: organizationFinancial.thruDate?.isValid() ? organizationFinancial.thruDate.toJSON() : undefined,
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
      res.body.forEach((organizationFinancial: IOrganizationFinancial) => {
        organizationFinancial.fromDate = organizationFinancial.fromDate ? dayjs(organizationFinancial.fromDate) : undefined;
        organizationFinancial.thruDate = organizationFinancial.thruDate ? dayjs(organizationFinancial.thruDate) : undefined;
      });
    }
    return res;
  }
}

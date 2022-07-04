import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IOrganizationLegal, getOrganizationLegalIdentifier } from '../organization-legal.model';

export type EntityResponseType = HttpResponse<IOrganizationLegal>;
export type EntityArrayResponseType = HttpResponse<IOrganizationLegal[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationLegalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-legals');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/organization-legals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationLegal: IOrganizationLegal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationLegal);
    return this.http
      .post<IOrganizationLegal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationLegal: IOrganizationLegal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationLegal);
    return this.http
      .put<IOrganizationLegal>(`${this.resourceUrl}/${getOrganizationLegalIdentifier(organizationLegal) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationLegal: IOrganizationLegal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationLegal);
    return this.http
      .patch<IOrganizationLegal>(`${this.resourceUrl}/${getOrganizationLegalIdentifier(organizationLegal) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationLegal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationLegal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationLegal[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addOrganizationLegalToCollectionIfMissing(
    organizationLegalCollection: IOrganizationLegal[],
    ...organizationLegalsToCheck: (IOrganizationLegal | null | undefined)[]
  ): IOrganizationLegal[] {
    const organizationLegals: IOrganizationLegal[] = organizationLegalsToCheck.filter(isPresent);
    if (organizationLegals.length > 0) {
      const organizationLegalCollectionIdentifiers = organizationLegalCollection.map(
        organizationLegalItem => getOrganizationLegalIdentifier(organizationLegalItem)!
      );
      const organizationLegalsToAdd = organizationLegals.filter(organizationLegalItem => {
        const organizationLegalIdentifier = getOrganizationLegalIdentifier(organizationLegalItem);
        if (organizationLegalIdentifier == null || organizationLegalCollectionIdentifiers.includes(organizationLegalIdentifier)) {
          return false;
        }
        organizationLegalCollectionIdentifiers.push(organizationLegalIdentifier);
        return true;
      });
      return [...organizationLegalsToAdd, ...organizationLegalCollection];
    }
    return organizationLegalCollection;
  }

  protected convertDateFromClient(organizationLegal: IOrganizationLegal): IOrganizationLegal {
    return Object.assign({}, organizationLegal, {
      fromDate: organizationLegal.fromDate?.isValid() ? organizationLegal.fromDate.toJSON() : undefined,
      thruDate: organizationLegal.thruDate?.isValid() ? organizationLegal.thruDate.toJSON() : undefined,
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
      res.body.forEach((organizationLegal: IOrganizationLegal) => {
        organizationLegal.fromDate = organizationLegal.fromDate ? dayjs(organizationLegal.fromDate) : undefined;
        organizationLegal.thruDate = organizationLegal.thruDate ? dayjs(organizationLegal.thruDate) : undefined;
      });
    }
    return res;
  }
}

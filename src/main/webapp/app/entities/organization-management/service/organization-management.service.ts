import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IOrganizationManagement, getOrganizationManagementIdentifier } from '../organization-management.model';

export type EntityResponseType = HttpResponse<IOrganizationManagement>;
export type EntityArrayResponseType = HttpResponse<IOrganizationManagement[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationManagementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organization-managements');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/organization-managements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organizationManagement: IOrganizationManagement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationManagement);
    return this.http
      .post<IOrganizationManagement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organizationManagement: IOrganizationManagement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationManagement);
    return this.http
      .put<IOrganizationManagement>(`${this.resourceUrl}/${getOrganizationManagementIdentifier(organizationManagement) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organizationManagement: IOrganizationManagement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organizationManagement);
    return this.http
      .patch<IOrganizationManagement>(
        `${this.resourceUrl}/${getOrganizationManagementIdentifier(organizationManagement) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganizationManagement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationManagement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganizationManagement[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addOrganizationManagementToCollectionIfMissing(
    organizationManagementCollection: IOrganizationManagement[],
    ...organizationManagementsToCheck: (IOrganizationManagement | null | undefined)[]
  ): IOrganizationManagement[] {
    const organizationManagements: IOrganizationManagement[] = organizationManagementsToCheck.filter(isPresent);
    if (organizationManagements.length > 0) {
      const organizationManagementCollectionIdentifiers = organizationManagementCollection.map(
        organizationManagementItem => getOrganizationManagementIdentifier(organizationManagementItem)!
      );
      const organizationManagementsToAdd = organizationManagements.filter(organizationManagementItem => {
        const organizationManagementIdentifier = getOrganizationManagementIdentifier(organizationManagementItem);
        if (
          organizationManagementIdentifier == null ||
          organizationManagementCollectionIdentifiers.includes(organizationManagementIdentifier)
        ) {
          return false;
        }
        organizationManagementCollectionIdentifiers.push(organizationManagementIdentifier);
        return true;
      });
      return [...organizationManagementsToAdd, ...organizationManagementCollection];
    }
    return organizationManagementCollection;
  }

  protected convertDateFromClient(organizationManagement: IOrganizationManagement): IOrganizationManagement {
    return Object.assign({}, organizationManagement, {
      fromDate: organizationManagement.fromDate?.isValid() ? organizationManagement.fromDate.toJSON() : undefined,
      thruDate: organizationManagement.thruDate?.isValid() ? organizationManagement.thruDate.toJSON() : undefined,
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
      res.body.forEach((organizationManagement: IOrganizationManagement) => {
        organizationManagement.fromDate = organizationManagement.fromDate ? dayjs(organizationManagement.fromDate) : undefined;
        organizationManagement.thruDate = organizationManagement.thruDate ? dayjs(organizationManagement.thruDate) : undefined;
      });
    }
    return res;
  }
}

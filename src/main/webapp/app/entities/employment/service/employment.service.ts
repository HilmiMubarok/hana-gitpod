import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEmployment, getEmploymentIdentifier } from '../employment.model';

export type EntityResponseType = HttpResponse<IEmployment>;
export type EntityArrayResponseType = HttpResponse<IEmployment[]>;

@Injectable({ providedIn: 'root' })
export class EmploymentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employments');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/employments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(employment: IEmployment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employment);
    return this.http
      .post<IEmployment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(employment: IEmployment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employment);
    return this.http
      .put<IEmployment>(`${this.resourceUrl}/${getEmploymentIdentifier(employment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(employment: IEmployment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(employment);
    return this.http
      .patch<IEmployment>(`${this.resourceUrl}/${getEmploymentIdentifier(employment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmployment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmployment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmployment[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addEmploymentToCollectionIfMissing(
    employmentCollection: IEmployment[],
    ...employmentsToCheck: (IEmployment | null | undefined)[]
  ): IEmployment[] {
    const employments: IEmployment[] = employmentsToCheck.filter(isPresent);
    if (employments.length > 0) {
      const employmentCollectionIdentifiers = employmentCollection.map(employmentItem => getEmploymentIdentifier(employmentItem)!);
      const employmentsToAdd = employments.filter(employmentItem => {
        const employmentIdentifier = getEmploymentIdentifier(employmentItem);
        if (employmentIdentifier == null || employmentCollectionIdentifiers.includes(employmentIdentifier)) {
          return false;
        }
        employmentCollectionIdentifiers.push(employmentIdentifier);
        return true;
      });
      return [...employmentsToAdd, ...employmentCollection];
    }
    return employmentCollection;
  }

  protected convertDateFromClient(employment: IEmployment): IEmployment {
    return Object.assign({}, employment, {
      fromDate: employment.fromDate?.isValid() ? employment.fromDate.toJSON() : undefined,
      thruDate: employment.thruDate?.isValid() ? employment.thruDate.toJSON() : undefined,
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
      res.body.forEach((employment: IEmployment) => {
        employment.fromDate = employment.fromDate ? dayjs(employment.fromDate) : undefined;
        employment.thruDate = employment.thruDate ? dayjs(employment.thruDate) : undefined;
      });
    }
    return res;
  }
}

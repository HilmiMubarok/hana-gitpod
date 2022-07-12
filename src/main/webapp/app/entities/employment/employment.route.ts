import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IEmployment, Employment } from './employment.model';
import { EmploymentService } from './employment.service';
import { EmploymentComponent } from './employment.component';
import { EmploymentDetailComponent } from './employment-detail.component';
import { EmploymentUpdateComponent } from './employment-update.component';

@Injectable({ providedIn: 'root' })
export class EmploymentResolve implements Resolve<IEmployment> {
  constructor(private service: EmploymentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployment> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employment: HttpResponse<Employment>) => {
          if (employment.body) {
            return of(employment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IEmployment>) => res.body),
        mergeMap(res => {
          if (res) {
            return of(res);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    const newItem = new Employment();
    const relationTypeId = route.queryParams['relationTypeId'] ? route.queryParams['relationTypeId'] : null;
    if (relationTypeId) {
      newItem.relationTypeId = relationTypeId;
    }
    const partyToId = route.queryParams['partyToId'] ? route.queryParams['partyToId'] : null;
    if (partyToId) {
      newItem.partyToId = partyToId;
    }
    const partyFromId = route.queryParams['partyFromId'] ? route.queryParams['partyFromId'] : null;
    if (partyFromId) {
      newItem.partyFromId = partyFromId;
    }
    return of(newItem);
  }
}

export const employmentRoute: Routes = [
  {
    path: '',
    component: EmploymentUpdateComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.employment.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmploymentDetailComponent,
    resolve: {
      employment: EmploymentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employment.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmploymentUpdateComponent,
    resolve: {
      content: EmploymentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employment.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmploymentUpdateComponent,
    resolve: {
      content: EmploymentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employment.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

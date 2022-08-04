import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IEmploymentType, EmploymentType } from './employment-type.model';
import { EmploymentTypeService } from './employment-type.service';
import { EmploymentTypeComponent } from './employment-type.component';
import { EmploymentTypeDetailComponent } from './employment-type-detail.component';
import { EmploymentTypeUpdateComponent } from './employment-type-update.component';

@Injectable({ providedIn: 'root' })
export class EmploymentTypeResolve implements Resolve<IEmploymentType> {
  constructor(private service: EmploymentTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmploymentType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employmentType: HttpResponse<EmploymentType>) => {
          if (employmentType.body) {
            return of(employmentType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IEmploymentType>) => res.body),
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
    const newItem = new EmploymentType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const employmentTypeRoute: Routes = [
  {
    path: '',
    component: EmploymentTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.employmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmploymentTypeDetailComponent,
    resolve: {
      employmentType: EmploymentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmploymentTypeUpdateComponent,
    resolve: {
      content: EmploymentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmploymentTypeUpdateComponent,
    resolve: {
      content: EmploymentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

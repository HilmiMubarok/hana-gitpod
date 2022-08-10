import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IEmployee, Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { EmployeeComponent } from './employee.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { EmployeeUpdateComponent } from './employee-update.component';

@Injectable({ providedIn: 'root' })
export class EmployeeResolve implements Resolve<IEmployee> {
  constructor(private service: EmployeeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployee> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employee: HttpResponse<Employee>) => {
          if (employee.body) {
            return of(employee.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IEmployee>) => res.body),
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
    const newItem = new Employee();
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    const personId = route.queryParams['personId'] ? route.queryParams['personId'] : null;
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    const employmentTypeId = route.queryParams['employmentTypeId'] ? route.queryParams['employmentTypeId'] : null;
    if (employmentTypeId) {
      newItem.employmentTypeId = employmentTypeId;
    }
    return of(newItem);
  }
}

export const employeeRoute: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.employee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmployeeDetailComponent,
    resolve: {
      employee: EmployeeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmployeeUpdateComponent,
    resolve: {
      content: EmployeeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmployeeUpdateComponent,
    resolve: {
      content: EmployeeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.employee.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

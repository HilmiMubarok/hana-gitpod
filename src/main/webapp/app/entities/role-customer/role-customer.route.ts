import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IRoleCustomer, RoleCustomer } from './role-customer.model';
import { RoleCustomerService } from './role-customer.service';
import { RoleCustomerComponent } from './role-customer.component';
import { RoleCustomerDetailComponent } from './role-customer-detail.component';
import { RoleCustomerUpdateComponent } from './role-customer-update.component';

@Injectable({ providedIn: 'root' })
export class RoleCustomerResolve implements Resolve<IRoleCustomer> {
  constructor(private service: RoleCustomerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoleCustomer> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roleCustomer: HttpResponse<RoleCustomer>) => {
          if (roleCustomer.body) {
            return of(roleCustomer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IRoleCustomer>) => res.body),
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
    const newItem = new RoleCustomer();
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const roleCustomerRoute: Routes = [
  {
    path: '',
    component: RoleCustomerComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.roleCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoleCustomerDetailComponent,
    resolve: {
      roleCustomer: RoleCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoleCustomerUpdateComponent,
    resolve: {
      content: RoleCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoleCustomerUpdateComponent,
    resolve: {
      content: RoleCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

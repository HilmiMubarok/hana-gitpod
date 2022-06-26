import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IOrganizationCustomer, OrganizationCustomer } from './organization-customer.model';
import { OrganizationCustomerService } from './organization-customer.service';
import { OrganizationCustomerComponent } from './organization-customer.component';
import { OrganizationCustomerDetailComponent } from './organization-customer-detail.component';
import { OrganizationCustomerUpdateComponent } from './organization-customer-update.component';

@Injectable({ providedIn: 'root' })
export class OrganizationCustomerResolve implements Resolve<IOrganizationCustomer> {
  constructor(private service: OrganizationCustomerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationCustomer> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationCustomer: HttpResponse<OrganizationCustomer>) => {
          if (organizationCustomer.body) {
            return of(organizationCustomer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IOrganizationCustomer>) => res.body),
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
    const newItem = new OrganizationCustomer();
    const partyTypeId = route.queryParams['partyTypeId'] ? route.queryParams['partyTypeId'] : null;
    if (partyTypeId) {
      newItem.partyTypeId = partyTypeId;
    }
    const postalAddressId = route.queryParams['postalAddressId'] ? route.queryParams['postalAddressId'] : null;
    if (postalAddressId) {
      newItem.postalAddressId = postalAddressId;
    }
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    return of(newItem);
  }
}

export const organizationCustomerRoute: Routes = [
  {
    path: '',
    component: OrganizationCustomerComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.organizationCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationCustomerDetailComponent,
    resolve: {
      organizationCustomer: OrganizationCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationCustomerUpdateComponent,
    resolve: {
      content: OrganizationCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationCustomerUpdateComponent,
    resolve: {
      content: OrganizationCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IOrganizationFinancial, OrganizationFinancial } from './organization-financial.model';
import { OrganizationFinancialService } from './organization-financial.service';
import { OrganizationFinancialComponent } from './organization-financial.component';
import { OrganizationFinancialDetailComponent } from './organization-financial-detail.component';
import { OrganizationFinancialUpdateComponent } from './organization-financial-update.component';

@Injectable({ providedIn: 'root' })
export class OrganizationFinancialResolve implements Resolve<IOrganizationFinancial> {
  constructor(private service: OrganizationFinancialService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationFinancial> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationFinancial: HttpResponse<OrganizationFinancial>) => {
          if (organizationFinancial.body) {
            return of(organizationFinancial.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IOrganizationFinancial>) => res.body),
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
    const newItem = new OrganizationFinancial();
    const organizationId = route.queryParams['organizationId'] ? route.queryParams['organizationId'] : null;
    if (organizationId) {
      newItem.organizationId = organizationId;
    }
    return of(newItem);
  }
}

export const organizationFinancialRoute: Routes = [
  {
    path: '',
    component: OrganizationFinancialComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.organizationFinancial.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationFinancialDetailComponent,
    resolve: {
      organizationFinancial: OrganizationFinancialResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationFinancial.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationFinancialUpdateComponent,
    resolve: {
      content: OrganizationFinancialResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationFinancial.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationFinancialUpdateComponent,
    resolve: {
      content: OrganizationFinancialResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationFinancial.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

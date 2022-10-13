import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';
import { OrganizationManagementComponent } from './organization-management.component';
import { OrganizationManagementDetailComponent } from './organization-management-detail.component';
import { OrganizationManagementUpdateComponent } from './organization-management-update.component';

@Injectable({ providedIn: 'root' })
export class OrganizationManagementResolve implements Resolve<IOrganizationManagement> {
  constructor(private service: OrganizationManagementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationManagement> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationManagement: HttpResponse<OrganizationManagement>) => {
          if (organizationManagement.body) {
            return of(organizationManagement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IOrganizationManagement>) => res.body),
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
    const newItem = new OrganizationManagement();
    return of(newItem);
  }
}

export const organizationManagementRoute: Routes = [
  {
    path: '',
    component: OrganizationManagementComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.organizationManagement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationManagementDetailComponent,
    resolve: {
      organizationManagement: OrganizationManagementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationManagement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationManagementUpdateComponent,
    resolve: {
      content: OrganizationManagementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationManagement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationManagementUpdateComponent,
    resolve: {
      content: OrganizationManagementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationManagement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

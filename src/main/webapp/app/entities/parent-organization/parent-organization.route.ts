import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IParentOrganization, ParentOrganization } from './parent-organization.model';
import { ParentOrganizationService } from './parent-organization.service';
import { ParentOrganizationComponent } from './parent-organization.component';
import { ParentOrganizationDetailComponent } from './parent-organization-detail.component';
import { ParentOrganizationUpdateComponent } from './parent-organization-update.component';

@Injectable({ providedIn: 'root' })
export class ParentOrganizationResolve implements Resolve<IParentOrganization> {
  constructor(private service: ParentOrganizationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParentOrganization> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parentOrganization: HttpResponse<ParentOrganization>) => {
          if (parentOrganization.body) {
            return of(parentOrganization.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IParentOrganization>) => res.body),
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
    const newItem = new ParentOrganization();
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

export const parentOrganizationRoute: Routes = [
  {
    path: '',
    component: ParentOrganizationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.parentOrganization.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParentOrganizationDetailComponent,
    resolve: {
      parentOrganization: ParentOrganizationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.parentOrganization.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParentOrganizationUpdateComponent,
    resolve: {
      content: ParentOrganizationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.parentOrganization.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParentOrganizationUpdateComponent,
    resolve: {
      content: ParentOrganizationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.parentOrganization.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

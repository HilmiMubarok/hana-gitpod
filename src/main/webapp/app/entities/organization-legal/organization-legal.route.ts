import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IOrganizationLegal, OrganizationLegal } from './organization-legal.model';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationLegalComponent } from './organization-legal.component';
import { OrganizationLegalDetailComponent } from './organization-legal-detail.component';
import { OrganizationLegalUpdateComponent } from './organization-legal-update.component';

@Injectable({ providedIn: 'root' })
export class OrganizationLegalResolve implements Resolve<IOrganizationLegal> {
  constructor(private service: OrganizationLegalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationLegal> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationLegal: HttpResponse<OrganizationLegal>) => {
          if (organizationLegal.body) {
            return of(organizationLegal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IOrganizationLegal>) => res.body),
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
    const newItem = new OrganizationLegal();
    const organizationId = route.queryParams['organizationId'] ? route.queryParams['organizationId'] : null;
    if (organizationId) {
      newItem.organizationId = organizationId;
    }
    return of(newItem);
  }
}

export const organizationLegalRoute: Routes = [
  {
    path: '',
    component: OrganizationLegalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.organizationLegal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationLegalDetailComponent,
    resolve: {
      organizationLegal: OrganizationLegalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationLegal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationLegalUpdateComponent,
    resolve: {
      content: OrganizationLegalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationLegal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationLegalUpdateComponent,
    resolve: {
      content: OrganizationLegalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.organizationLegal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

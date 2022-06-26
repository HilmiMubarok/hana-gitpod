import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IInternal, Internal } from './internal.model';
import { InternalService } from './internal.service';
import { InternalComponent } from './internal.component';
import { InternalDetailComponent } from './internal-detail.component';
import { InternalUpdateComponent } from './internal-update.component';

@Injectable({ providedIn: 'root' })
export class InternalResolve implements Resolve<IInternal> {
  constructor(private service: InternalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInternal> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((internal: HttpResponse<Internal>) => {
          if (internal.body) {
            return of(internal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IInternal>) => res.body),
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
    const newItem = new Internal();
    const internalTypeId = route.queryParams['internalTypeId'] ? route.queryParams['internalTypeId'] : null;
    if (internalTypeId) {
      newItem.internalTypeId = internalTypeId;
    }
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const partyOwnerId = route.queryParams['partyOwnerId'] ? route.queryParams['partyOwnerId'] : null;
    if (partyOwnerId) {
      newItem.partyOwnerId = partyOwnerId;
    }
    const postalAddressId = route.queryParams['postalAddressId'] ? route.queryParams['postalAddressId'] : null;
    if (postalAddressId) {
      newItem.postalAddressId = postalAddressId;
    }
    const organizationId = route.queryParams['organizationId'] ? route.queryParams['organizationId'] : null;
    if (organizationId) {
      newItem.organizationId = organizationId;
    }
    const facilityId = route.queryParams['facilityId'] ? route.queryParams['facilityId'] : null;
    if (facilityId) {
      newItem.facilityId = facilityId;
    }
    return of(newItem);
  }
}

export const internalRoute: Routes = [
  {
    path: '',
    component: InternalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.internal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InternalDetailComponent,
    resolve: {
      internal: InternalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.internal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InternalUpdateComponent,
    resolve: {
      content: InternalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.internal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InternalUpdateComponent,
    resolve: {
      content: InternalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.internal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

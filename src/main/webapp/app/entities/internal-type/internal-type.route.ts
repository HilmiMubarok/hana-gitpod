import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IInternalType, InternalType } from './internal-type.model';
import { InternalTypeService } from './internal-type.service';
import { InternalTypeComponent } from './internal-type.component';
import { InternalTypeDetailComponent } from './internal-type-detail.component';
import { InternalTypeUpdateComponent } from './internal-type-update.component';

@Injectable({ providedIn: 'root' })
export class InternalTypeResolve implements Resolve<IInternalType> {
  constructor(private service: InternalTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInternalType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((internalType: HttpResponse<InternalType>) => {
          if (internalType.body) {
            return of(internalType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IInternalType>) => res.body),
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
    const newItem = new InternalType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const internalTypeRoute: Routes = [
  {
    path: '',
    component: InternalTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.internalType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InternalTypeDetailComponent,
    resolve: {
      internalType: InternalTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.internalType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InternalTypeUpdateComponent,
    resolve: {
      content: InternalTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.internalType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InternalTypeUpdateComponent,
    resolve: {
      content: InternalTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.internalType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

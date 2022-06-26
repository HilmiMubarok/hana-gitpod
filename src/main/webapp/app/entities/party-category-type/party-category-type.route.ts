import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyCategoryType, PartyCategoryType } from './party-category-type.model';
import { PartyCategoryTypeService } from './party-category-type.service';
import { PartyCategoryTypeComponent } from './party-category-type.component';
import { PartyCategoryTypeDetailComponent } from './party-category-type-detail.component';
import { PartyCategoryTypeUpdateComponent } from './party-category-type-update.component';

@Injectable({ providedIn: 'root' })
export class PartyCategoryTypeResolve implements Resolve<IPartyCategoryType> {
  constructor(private service: PartyCategoryTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyCategoryType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyCategoryType: HttpResponse<PartyCategoryType>) => {
          if (partyCategoryType.body) {
            return of(partyCategoryType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyCategoryType>) => res.body),
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
    const newItem = new PartyCategoryType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const partyCategoryTypeRoute: Routes = [
  {
    path: '',
    component: PartyCategoryTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyCategoryTypeDetailComponent,
    resolve: {
      partyCategoryType: PartyCategoryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyCategoryTypeUpdateComponent,
    resolve: {
      content: PartyCategoryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyCategoryTypeUpdateComponent,
    resolve: {
      content: PartyCategoryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

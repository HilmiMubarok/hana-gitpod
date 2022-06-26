import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyCategory, PartyCategory } from './party-category.model';
import { PartyCategoryService } from './party-category.service';
import { PartyCategoryComponent } from './party-category.component';
import { PartyCategoryDetailComponent } from './party-category-detail.component';
import { PartyCategoryUpdateComponent } from './party-category-update.component';

@Injectable({ providedIn: 'root' })
export class PartyCategoryResolve implements Resolve<IPartyCategory> {
  constructor(private service: PartyCategoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyCategory> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyCategory: HttpResponse<PartyCategory>) => {
          if (partyCategory.body) {
            return of(partyCategory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyCategory>) => res.body),
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
    const newItem = new PartyCategory();
    const categoryTypeId = route.queryParams['categoryTypeId'] ? route.queryParams['categoryTypeId'] : null;
    if (categoryTypeId) {
      newItem.categoryTypeId = categoryTypeId;
    }
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const partyCategoryRoute: Routes = [
  {
    path: '',
    component: PartyCategoryComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyCategoryDetailComponent,
    resolve: {
      partyCategory: PartyCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyCategoryUpdateComponent,
    resolve: {
      content: PartyCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyCategoryUpdateComponent,
    resolve: {
      content: PartyCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

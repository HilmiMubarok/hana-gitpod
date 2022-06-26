import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ITaxType, TaxType } from './tax-type.model';
import { TaxTypeService } from './tax-type.service';
import { TaxTypeComponent } from './tax-type.component';
import { TaxTypeDetailComponent } from './tax-type-detail.component';
import { TaxTypeUpdateComponent } from './tax-type-update.component';

@Injectable({ providedIn: 'root' })
export class TaxTypeResolve implements Resolve<ITaxType> {
  constructor(private service: TaxTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITaxType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((taxType: HttpResponse<TaxType>) => {
          if (taxType.body) {
            return of(taxType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ITaxType>) => res.body),
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
    const newItem = new TaxType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const taxTypeRoute: Routes = [
  {
    path: '',
    component: TaxTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.taxType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaxTypeDetailComponent,
    resolve: {
      taxType: TaxTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.taxType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TaxTypeUpdateComponent,
    resolve: {
      content: TaxTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.taxType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TaxTypeUpdateComponent,
    resolve: {
      content: TaxTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.taxType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

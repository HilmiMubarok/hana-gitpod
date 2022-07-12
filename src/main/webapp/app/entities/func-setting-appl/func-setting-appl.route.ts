import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFuncSettingAppl, FuncSettingAppl } from './func-setting-appl.model';
import { FuncSettingApplService } from './func-setting-appl.service';
import { FuncSettingApplComponent } from './func-setting-appl.component';
import { FuncSettingApplDetailComponent } from './func-setting-appl-detail.component';
import { FuncSettingApplUpdateComponent } from './func-setting-appl-update.component';

@Injectable({ providedIn: 'root' })
export class FuncSettingApplResolve implements Resolve<IFuncSettingAppl> {
  constructor(private service: FuncSettingApplService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFuncSettingAppl> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((funcSettingAppl: HttpResponse<FuncSettingAppl>) => {
          if (funcSettingAppl.body) {
            return of(funcSettingAppl.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFuncSettingAppl>) => res.body),
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
    const newItem = new FuncSettingAppl();
    const featureApplicableId = route.queryParams['featureApplicableId'] ? route.queryParams['featureApplicableId'] : null;
    if (featureApplicableId) {
      newItem.featureApplicableId = featureApplicableId;
    }
    const funcSettingId = route.queryParams['funcSettingId'] ? route.queryParams['funcSettingId'] : null;
    if (funcSettingId) {
      newItem.funcSettingId = funcSettingId;
    }
    return of(newItem);
  }
}

export const funcSettingApplRoute: Routes = [
  {
    path: '',
    component: FuncSettingApplComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.funcSettingAppl.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FuncSettingApplDetailComponent,
    resolve: {
      funcSettingAppl: FuncSettingApplResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSettingAppl.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FuncSettingApplUpdateComponent,
    resolve: {
      content: FuncSettingApplResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSettingAppl.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FuncSettingApplUpdateComponent,
    resolve: {
      content: FuncSettingApplResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSettingAppl.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

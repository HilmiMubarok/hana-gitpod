import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFuncSetting, FuncSetting } from './func-setting.model';
import { FuncSettingService } from './func-setting.service';
import { FuncSettingComponent } from './func-setting.component';
import { FuncSettingDetailComponent } from './func-setting-detail.component';
import { FuncSettingUpdateComponent } from './func-setting-update.component';

@Injectable({ providedIn: 'root' })
export class FuncSettingResolve implements Resolve<IFuncSetting> {
  constructor(private service: FuncSettingService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFuncSetting> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((funcSetting: HttpResponse<FuncSetting>) => {
          if (funcSetting.body) {
            return of(funcSetting.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFuncSetting>) => res.body),
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
    const newItem = new FuncSetting();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const funcSettingRoute: Routes = [
  {
    path: '',
    component: FuncSettingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.funcSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FuncSettingDetailComponent,
    resolve: {
      funcSetting: FuncSettingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FuncSettingUpdateComponent,
    resolve: {
      content: FuncSettingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FuncSettingUpdateComponent,
    resolve: {
      content: FuncSettingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

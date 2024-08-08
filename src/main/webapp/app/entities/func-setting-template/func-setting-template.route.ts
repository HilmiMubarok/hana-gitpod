import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFuncSettingTemplate, FuncSettingTemplate } from './func-setting-template.model';
import { FuncSettingTemplateService } from './func-setting-template.service';
import { FuncSettingTemplateComponent } from './func-setting-template.component';
import { FuncSettingTemplateDetailComponent } from './func-setting-template-detail.component';
import { FuncSettingTemplateUpdateComponent } from './func-setting-template-update.component';

@Injectable({ providedIn: 'root' })
export class FuncSettingTemplateResolve implements Resolve<IFuncSettingTemplate> {
  constructor(private service: FuncSettingTemplateService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFuncSettingTemplate> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((funcSettingTemplate: HttpResponse<FuncSettingTemplate>) => {
          if (funcSettingTemplate.body) {
            return of(funcSettingTemplate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFuncSettingTemplate>) => res.body),
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
    const newItem = new FuncSettingTemplate();
    const productTypeId = route.queryParams['productTypeId'] ? route.queryParams['productTypeId'] : null;
    if (productTypeId) {
      newItem.productTypeId = productTypeId;
    }
    const featureId = route.queryParams['featureId'] ? route.queryParams['featureId'] : null;
    if (featureId) {
      newItem.featureId = featureId;
    }
    const funcSettingId = route.queryParams['funcSettingId'] ? route.queryParams['funcSettingId'] : null;
    if (funcSettingId) {
      newItem.funcSettingId = funcSettingId;
    }
    return of(newItem);
  }
}

export const funcSettingTemplateRoute: Routes = [
  {
    path: '',
    component: FuncSettingTemplateComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.funcSettingTemplate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FuncSettingTemplateDetailComponent,
    resolve: {
      funcSettingTemplate: FuncSettingTemplateResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSettingTemplate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FuncSettingTemplateUpdateComponent,
    resolve: {
      content: FuncSettingTemplateResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSettingTemplate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FuncSettingTemplateUpdateComponent,
    resolve: {
      content: FuncSettingTemplateResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.funcSettingTemplate.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

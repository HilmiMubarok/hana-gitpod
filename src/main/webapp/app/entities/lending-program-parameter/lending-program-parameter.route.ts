import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ILendingProgramParameter, LendingProgramParameter } from './lending-program-parameter.model';
import { LendingProgramParameterService } from './lending-program-parameter.service';
import { LendingProgramParameterComponent } from './lending-program-parameter.component';
import { LendingProgramParameterDetailComponent } from './lending-program-parameter-detail.component';
import { LendingProgramParameterUpdateComponent } from './lending-program-parameter-update.component';

@Injectable({ providedIn: 'root' })
export class LendingProgramParameterResolve implements Resolve<ILendingProgramParameter> {
  constructor(private service: LendingProgramParameterService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILendingProgramParameter> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lendingProgramParameter: HttpResponse<LendingProgramParameter>) => {
          if (lendingProgramParameter.body) {
            return of(lendingProgramParameter.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ILendingProgramParameter>) => res.body),
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
    const newItem = new LendingProgramParameter();
    return of(newItem);
  }
}

export const lendingProgramParameterRoute: Routes = [
  {
    path: '',
    component: LendingProgramParameterComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.lendingProgramParameter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LendingProgramParameterDetailComponent,
    resolve: {
      lendingProgramParameter: LendingProgramParameterResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.lendingProgramParameter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LendingProgramParameterUpdateComponent,
    resolve: {
      content: LendingProgramParameterResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.lendingProgramParameter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LendingProgramParameterUpdateComponent,
    resolve: {
      content: LendingProgramParameterResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.lendingProgramParameter.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

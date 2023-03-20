import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IRequestSlik, RequestSlik, requestSlikData } from './request-slik.model';
import { RequestSlikService } from './request-slik.service';
import { RequestSlikComponent } from './request-slik.component';
import { RequestSlikDetailComponent } from './request-slik-detail.component';
import { RequestSlikUpdateComponent } from './request-slik-update.component';

@Injectable({ providedIn: 'root' })
export class RequestSlikResolve implements Resolve<IRequestSlik> {
  constructor(private service: RequestSlikService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRequestSlik> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((requestSlik: HttpResponse<RequestSlik>) => {
          if (requestSlik.body) {
            return of(requestSlik.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IRequestSlik>) => res.body),
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
    const newItem = new RequestSlik();
    return of(newItem);
  }
}

export const requestSlikRoute: Routes = [
  {
    path: '',
    component: RequestSlikComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.requestSlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RequestSlikDetailComponent,
    resolve: {
      requestSlik: RequestSlikResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.requestSlik.home.title',
      requestSlik: requestSlikData,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RequestSlikUpdateComponent,
    // resolve: {
    //   content: RequestSlikResolve,
    // },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.requestSlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RequestSlikUpdateComponent,
    // resolve: {
    //   content: RequestSlikResolve,
    // },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.requestSlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

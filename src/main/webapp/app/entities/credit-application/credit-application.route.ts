import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICreditApplication, CreditApplication } from './credit-application.model';
import { CreditApplicationService } from './credit-application.service';
import { CreditApplicationComponent } from './credit-application.component';
import { CreditApplicationDetailComponent } from './credit-application-detail.component';
import { CreditApplicationUpdateComponent } from './credit-application-update.component';
import { CreditApplicationCombineComponent } from './credit-application-combine.component';

@Injectable({ providedIn: 'root' })
export class CreditApplicationResolve implements Resolve<ICreditApplication> {
  constructor(private service: CreditApplicationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditApplication> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditApplication: HttpResponse<CreditApplication>) => {
          if (creditApplication.body) {
            return of(creditApplication.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICreditApplication>) => res.body),
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
    const newItem = new CreditApplication();
    return of(newItem);
  }
}

export const creditApplicationRoute: Routes = [
  {
    path: '',
    component: CreditApplicationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.creditApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'form',
    component: CreditApplicationCombineComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditApplicationDetailComponent,
    resolve: {
      creditApplication: CreditApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditApplicationUpdateComponent,
    resolve: {
      content: CreditApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditApplicationUpdateComponent,
    resolve: {
      content: CreditApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

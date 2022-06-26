import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ILoanApplication, LoanApplication } from './loan-application.model';
import { LoanApplicationService } from './loan-application.service';
import { LoanApplicationComponent } from './loan-application.component';
import { LoanApplicationDetailComponent } from './loan-application-detail.component';
import { LoanApplicationUpdateComponent } from './loan-application-update.component';

@Injectable({ providedIn: 'root' })
export class LoanApplicationResolve implements Resolve<ILoanApplication> {
  constructor(private service: LoanApplicationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoanApplication> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loanApplication: HttpResponse<LoanApplication>) => {
          if (loanApplication.body) {
            return of(loanApplication.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ILoanApplication>) => res.body),
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
    const newItem = new LoanApplication();
    const applicationTypeId = route.queryParams['applicationTypeId'] ? route.queryParams['applicationTypeId'] : null;
    if (applicationTypeId) {
      newItem.applicationTypeId = applicationTypeId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const loanApplicationRoute: Routes = [
  {
    path: '',
    component: LoanApplicationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,desc',
      pageTitle: 'losgwApp.loanApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoanApplicationDetailComponent,
    resolve: {
      loanApplication: LoanApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.loanApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoanApplicationUpdateComponent,
    resolve: {
      content: LoanApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.loanApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoanApplicationUpdateComponent,
    resolve: {
      content: LoanApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.loanApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBillingTerm, BillingTerm } from './billing-term.model';
import { BillingTermService } from './billing-term.service';
import { BillingTermComponent } from './billing-term.component';
import { BillingTermDetailComponent } from './billing-term-detail.component';
import { BillingTermUpdateComponent } from './billing-term-update.component';

@Injectable({ providedIn: 'root' })
export class BillingTermResolve implements Resolve<IBillingTerm> {
  constructor(private service: BillingTermService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillingTerm> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billingTerm: HttpResponse<BillingTerm>) => {
          if (billingTerm.body) {
            return of(billingTerm.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBillingTerm>) => res.body),
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
    const newItem = new BillingTerm();
    const billingId = route.queryParams['billingId'] ? route.queryParams['billingId'] : null;
    if (billingId) {
      newItem.billingId = billingId;
    }
    const termTypeId = route.queryParams['termTypeId'] ? route.queryParams['termTypeId'] : null;
    if (termTypeId) {
      newItem.termTypeId = termTypeId;
    }
    return of(newItem);
  }
}

export const billingTermRoute: Routes = [
  {
    path: '',
    component: BillingTermComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.billingTerm.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingTermDetailComponent,
    resolve: {
      billingTerm: BillingTermResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingTerm.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingTermUpdateComponent,
    resolve: {
      content: BillingTermResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingTerm.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingTermUpdateComponent,
    resolve: {
      content: BillingTermResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingTerm.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

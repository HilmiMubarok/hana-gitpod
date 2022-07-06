import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICreditRating, CreditRating } from './credit-rating.model';
import { CreditRatingService } from './credit-rating.service';
import { CreditRatingComponent } from './credit-rating.component';
import { CreditRatingDetailComponent } from './credit-rating-detail.component';
import { CreditRatingUpdateComponent } from './credit-rating-update.component';

@Injectable({ providedIn: 'root' })
export class CreditRatingResolve implements Resolve<ICreditRating> {
  constructor(private service: CreditRatingService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditRating> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditRating: HttpResponse<CreditRating>) => {
          if (creditRating.body) {
            return of(creditRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICreditRating>) => res.body),
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
    const newItem = new CreditRating();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const applicationId = route.queryParams['applicationId'] ? route.queryParams['applicationId'] : null;
    if (applicationId) {
      newItem.applicationId = applicationId;
    }
    return of(newItem);
  }
}

export const creditRatingRoute: Routes = [
  {
    path: '',
    component: CreditRatingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.creditRating.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditRatingDetailComponent,
    resolve: {
      creditRating: CreditRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditRating.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditRatingUpdateComponent,
    resolve: {
      content: CreditRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditRating.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditRatingUpdateComponent,
    resolve: {
      content: CreditRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditRating.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

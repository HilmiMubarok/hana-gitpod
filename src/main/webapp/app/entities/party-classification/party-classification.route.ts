import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyClassification, PartyClassification } from './party-classification.model';
import { PartyClassificationService } from './party-classification.service';
import { PartyClassificationComponent } from './party-classification.component';
import { PartyClassificationDetailComponent } from './party-classification-detail.component';
import { PartyClassificationUpdateComponent } from './party-classification-update.component';

@Injectable({ providedIn: 'root' })
export class PartyClassificationResolve implements Resolve<IPartyClassification> {
  constructor(private service: PartyClassificationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyClassification> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyClassification: HttpResponse<PartyClassification>) => {
          if (partyClassification.body) {
            return of(partyClassification.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyClassification>) => res.body),
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
    const newItem = new PartyClassification();
    const categoryId = route.queryParams['categoryId'] ? route.queryParams['categoryId'] : null;
    if (categoryId) {
      newItem.categoryId = categoryId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const partyClassificationRoute: Routes = [
  {
    path: '',
    component: PartyClassificationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyClassificationDetailComponent,
    resolve: {
      partyClassification: PartyClassificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyClassificationUpdateComponent,
    resolve: {
      content: PartyClassificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyClassificationUpdateComponent,
    resolve: {
      content: PartyClassificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

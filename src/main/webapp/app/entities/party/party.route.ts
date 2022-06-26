import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IParty, Party } from './party.model';
import { PartyService } from './party.service';
import { PartyComponent } from './party.component';
import { PartyDetailComponent } from './party-detail.component';
import { PartyUpdateComponent } from './party-update.component';

@Injectable({ providedIn: 'root' })
export class PartyResolve implements Resolve<IParty> {
  constructor(private service: PartyService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParty> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((party: HttpResponse<Party>) => {
          if (party.body) {
            return of(party.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IParty>) => res.body),
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
    const newItem = new Party();
    const partyTypeId = route.queryParams['partyTypeId'] ? route.queryParams['partyTypeId'] : null;
    if (partyTypeId) {
      newItem.partyTypeId = partyTypeId;
    }
    return of(newItem);
  }
}

export const partyRoute: Routes = [
  {
    path: '',
    component: PartyComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.party.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyDetailComponent,
    resolve: {
      party: PartyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.party.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyUpdateComponent,
    resolve: {
      content: PartyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.party.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyUpdateComponent,
    resolve: {
      content: PartyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.party.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

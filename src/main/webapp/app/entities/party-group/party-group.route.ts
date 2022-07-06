import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyGroup, PartyGroup } from './party-group.model';
import { PartyGroupService } from './party-group.service';
import { PartyGroupComponent } from './party-group.component';
import { PartyGroupDetailComponent } from './party-group-detail.component';
import { PartyGroupUpdateComponent } from './party-group-update.component';

@Injectable({ providedIn: 'root' })
export class PartyGroupResolve implements Resolve<IPartyGroup> {
  constructor(private service: PartyGroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyGroup> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyGroup: HttpResponse<PartyGroup>) => {
          if (partyGroup.body) {
            return of(partyGroup.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyGroup>) => res.body),
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
    const newItem = new PartyGroup();
    const partyTypeId = route.queryParams['partyTypeId'] ? route.queryParams['partyTypeId'] : null;
    if (partyTypeId) {
      newItem.partyTypeId = partyTypeId;
    }
    const postalAddressId = route.queryParams['postalAddressId'] ? route.queryParams['postalAddressId'] : null;
    if (postalAddressId) {
      newItem.postalAddressId = postalAddressId;
    }
    return of(newItem);
  }
}

export const partyGroupRoute: Routes = [
  {
    path: '',
    component: PartyGroupComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyGroupDetailComponent,
    resolve: {
      partyGroup: PartyGroupResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyGroupUpdateComponent,
    resolve: {
      content: PartyGroupResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyGroupUpdateComponent,
    resolve: {
      content: PartyGroupResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

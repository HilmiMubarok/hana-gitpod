import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartySlik, PartySlik } from './party-slik.model';
import { PartySlikService } from './party-slik.service';
import { PartySlikComponent } from './party-slik.component';
import { PartySlikDetailComponent } from './party-slik-detail.component';
import { PartySlikUpdateComponent } from './party-slik-update.component';

@Injectable({ providedIn: 'root' })
export class PartySlikResolve implements Resolve<IPartySlik> {
  constructor(private service: PartySlikService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartySlik> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partySlik: HttpResponse<PartySlik>) => {
          if (partySlik.body) {
            return of(partySlik.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartySlik>) => res.body),
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
    const newItem = new PartySlik();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const partySlikRoute: Routes = [
  {
    path: '',
    component: PartySlikComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partySlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartySlikDetailComponent,
    resolve: {
      partySlik: PartySlikResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partySlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartySlikUpdateComponent,
    resolve: {
      content: PartySlikResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partySlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartySlikUpdateComponent,
    resolve: {
      content: PartySlikResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partySlik.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

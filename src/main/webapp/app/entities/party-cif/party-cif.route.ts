import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyCif, PartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { PartyCifComponent } from './party-cif.component';
import { PartyCifDetailComponent } from './party-cif-detail.component';
import { PartyCifUpdateComponent } from './party-cif-update.component';

@Injectable({ providedIn: 'root' })
export class PartyCifResolve implements Resolve<IPartyCif> {
  constructor(private service: PartyCifService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyCif> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyCif: HttpResponse<PartyCif>) => {
          if (partyCif.body) {
            return of(partyCif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyCif>) => res.body),
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
    const newItem = new PartyCif();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const branchId = route.queryParams['branchId'] ? route.queryParams['branchId'] : null;
    if (branchId) {
      newItem.branchId = branchId;
    }
    return of(newItem);
  }
}

export const partyCifRoute: Routes = [
  {
    path: '',
    component: PartyCifComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyCifDetailComponent,
    resolve: {
      partyCif: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyCifUpdateComponent,
    resolve: {
      content: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyCifUpdateComponent,
    resolve: {
      content: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

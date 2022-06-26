import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyRole, PartyRole } from './party-role.model';
import { PartyRoleService } from './party-role.service';
import { PartyRoleComponent } from './party-role.component';
import { PartyRoleDetailComponent } from './party-role-detail.component';
import { PartyRoleUpdateComponent } from './party-role-update.component';

@Injectable({ providedIn: 'root' })
export class PartyRoleResolve implements Resolve<IPartyRole> {
  constructor(private service: PartyRoleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyRole> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyRole: HttpResponse<PartyRole>) => {
          if (partyRole.body) {
            return of(partyRole.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyRole>) => res.body),
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
    const newItem = new PartyRole();
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const partyRoleRoute: Routes = [
  {
    path: '',
    component: PartyRoleComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyRole.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyRoleDetailComponent,
    resolve: {
      partyRole: PartyRoleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyRole.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyRoleUpdateComponent,
    resolve: {
      content: PartyRoleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyRole.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyRoleUpdateComponent,
    resolve: {
      content: PartyRoleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyRole.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

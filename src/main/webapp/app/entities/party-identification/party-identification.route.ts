import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyIdentification, PartyIdentification } from './party-identification.model';
import { PartyIdentificationService } from './party-identification.service';
import { PartyIdentificationComponent } from './party-identification.component';
import { PartyIdentificationDetailComponent } from './party-identification-detail.component';
import { PartyIdentificationUpdateComponent } from './party-identification-update.component';

@Injectable({ providedIn: 'root' })
export class PartyIdentificationResolve implements Resolve<IPartyIdentification> {
  constructor(private service: PartyIdentificationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyIdentification> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyIdentification: HttpResponse<PartyIdentification>) => {
          if (partyIdentification.body) {
            return of(partyIdentification.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyIdentification>) => res.body),
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
    const newItem = new PartyIdentification();
    const identificationTypeId = route.queryParams['identificationTypeId'] ? route.queryParams['identificationTypeId'] : null;
    if (identificationTypeId) {
      newItem.identificationTypeId = identificationTypeId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const partyIdentificationRoute: Routes = [
  {
    path: '',
    component: PartyIdentificationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyIdentificationDetailComponent,
    resolve: {
      partyIdentification: PartyIdentificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyIdentificationUpdateComponent,
    resolve: {
      content: PartyIdentificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyIdentificationUpdateComponent,
    resolve: {
      content: PartyIdentificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

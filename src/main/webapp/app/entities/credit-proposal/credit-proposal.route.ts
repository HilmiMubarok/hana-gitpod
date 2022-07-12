import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { CreditProposalComponent } from './credit-proposal.component';
import { CreditProposalDetailComponent } from './credit-proposal-detail.component';
import { CreditProposalUpdateComponent } from './credit-proposal-update.component';

@Injectable({ providedIn: 'root' })
export class CreditProposalResolve implements Resolve<ICreditProposal> {
  constructor(private service: CreditProposalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditProposal> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditProposal: HttpResponse<CreditProposal>) => {
          if (creditProposal.body) {
            return of(creditProposal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICreditProposal>) => res.body),
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
    const newItem = new CreditProposal();
    const applicationTypeId = route.queryParams['applicationTypeId'] ? route.queryParams['applicationTypeId'] : null;
    if (applicationTypeId) {
      newItem.applicationTypeId = applicationTypeId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    const financialProductId = route.queryParams['financialProductId'] ? route.queryParams['financialProductId'] : null;
    if (financialProductId) {
      newItem.financialProductId = financialProductId;
    }
    const prospectId = route.queryParams['prospectId'] ? route.queryParams['prospectId'] : null;
    if (prospectId) {
      newItem.prospectId = prospectId;
    }
    const spouseId = route.queryParams['spouseId'] ? route.queryParams['spouseId'] : null;
    if (spouseId) {
      newItem.spouseId = spouseId;
    }
    return of(newItem);
  }
}

export const creditProposalRoute: Routes = [
  {
    path: '',
    component: CreditProposalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditProposalDetailComponent,
    resolve: {
      creditProposal: CreditProposalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditProposalUpdateComponent,
    resolve: {
      content: CreditProposalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditProposalUpdateComponent,
    resolve: {
      content: CreditProposalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

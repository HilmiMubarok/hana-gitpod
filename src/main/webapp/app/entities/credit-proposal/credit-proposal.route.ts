import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router, ExtraOptions } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
import { CreditProposalComponent } from './credit-proposal.component';
import { CreditProposalListComponent } from './credit-proposal-list-component';
import { CreditRating } from '../credit-rating/credit-rating.model';

import { ProposalBasicInformationComponent } from './proposal-basic-information.component';

@Injectable({ providedIn: 'root' })
export class CreditProposalResolve implements Resolve<ICreditProposal> {
  constructor(private service: CreditProposalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditProposal> | Observable<never> {
    const useTemplate = 'PERSON';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditProposal: HttpResponse<CreditProposal>) => {
          if (creditProposal.body) {
            if (creditProposal.body.prospectOrganization) {
              creditProposal.body.prospectOrganization.cif = creditProposal.body.prospectOrganization.attributes['cif'];
              creditProposal.body.prospectOrganization.businessTypeId =
                creditProposal.body.prospectOrganization.attributes['businessTypeId'];
              creditProposal.body.prospectOrganization.bodTermEndDate =
                creditProposal.body.prospectOrganization.attributes['bodTermEndDate'];
              creditProposal.body.prospectOrganization.deedOfEstablishNo =
                creditProposal.body.prospectOrganization.attributes['deedOfEstablishNo'];
              creditProposal.body.prospectOrganization.endOfDate = creditProposal.body.prospectOrganization.attributes['endOfDate'];
              creditProposal.body.prospectOrganization.identityTypeId =
                creditProposal.body.prospectOrganization.attributes['identityTypeId'];
              creditProposal.body.prospectOrganization.identityNumber =
                creditProposal.body.prospectOrganization.attributes['identityNumber'];
              creditProposal.body.prospectOrganization.koreanIdNumber =
                creditProposal.body.prospectOrganization.attributes['koreanIdNumber'];
              creditProposal.body.prospectOrganization.lineOfBusinessId =
                creditProposal.body.prospectOrganization.attributes['lineOfBusinessId'];
              creditProposal.body.prospectOrganization.notaryName = creditProposal.body.prospectOrganization.attributes['notaryName'];
              creditProposal.body.prospectOrganization.npwp = creditProposal.body.prospectOrganization.attributes['npwp'];
              creditProposal.body.prospectOrganization.otherName = creditProposal.body.prospectOrganization.attributes['otherName'];
              creditProposal.body.prospectOrganization.pepId = creditProposal.body.prospectOrganization.attributes['pepId'];
              creditProposal.body.prospectOrganization.pic = creditProposal.body.prospectOrganization.attributes['pic'];
              creditProposal.body.prospectOrganization.riskProfileId = creditProposal.body.prospectOrganization.attributes['riskProfileId'];
            }

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
    path: 'basic-information-1',
    component: ProposalBasicInformationComponent,
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
    path: 'list',
    component: CreditProposalListComponent,
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
    path: 'new',
    component: CreditProposalUpdateCustomComponent,
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
    component: CreditProposalUpdateCustomComponent,
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

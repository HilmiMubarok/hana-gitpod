import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import lodash from 'lodash';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DebtorCreditRatings } from '../debtor-data/credit-rating/credit-ratings.model';
import { DebtorDataSlikSummaryDebiturViewComponent } from '../debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur-view.component';
import { CreditAgreementComponent } from './credit-agreement.component';
import { CreditAgreementDetailComponent } from './credit-agreementdetail.component';
import { CreditAgreementService } from './credit-agreement.service';
import { CreditAgreement, ICreditAgreement } from './credit-agreement.model';

@Injectable({ providedIn: 'root' })
export class CreditAgreementReviewResolve implements Resolve<ICreditAgreement> {
  constructor(private service: CreditAgreementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditAgreement> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditAgreement: HttpResponse<ICreditAgreement>) => {
          if (creditAgreement.body) {
            if (creditAgreement.body.collaterals.length > 0) {
              for (let i = 0; i < creditAgreement.body.collaterals.length; i++) {
                if (!lodash.has(creditAgreement.body.collaterals[i].attributes, 'notes')) {
                  creditAgreement.body.collaterals[i].attributes['notes'] = '';
                }

                if (!lodash.has(creditAgreement.body.collaterals[i].attributes, 'crossCollateral')) {
                  creditAgreement.body.collaterals[i].attributes['crossCollateral'] = '';
                }

                if (!lodash.has(creditAgreement.body.collaterals[i].attributes, 'bindingValue')) {
                  creditAgreement.body.collaterals[i].attributes['bindingValue'] = '';
                }
              }
            }

            if (creditAgreement.body.prospectOrganization) {
              creditAgreement.body.prospectOrganization.cif = creditAgreement.body.prospectOrganization.attributes['cif'];
              creditAgreement.body.prospectOrganization.businessTypeId =
                creditAgreement.body.prospectOrganization.attributes['businessTypeId'];
              creditAgreement.body.prospectOrganization.bodTermEndDate =
                creditAgreement.body.prospectOrganization.attributes['bodTermEndDate'];
              creditAgreement.body.prospectOrganization.deedOfEstablishNo =
                creditAgreement.body.prospectOrganization.attributes['deedOfEstablishNo'];
              creditAgreement.body.prospectOrganization.endOfDate = creditAgreement.body.prospectOrganization.attributes['endOfDate'];
              creditAgreement.body.prospectOrganization.identityTypeId =
                creditAgreement.body.prospectOrganization.attributes['identityTypeId'];
              creditAgreement.body.prospectOrganization.identityNumber =
                creditAgreement.body.prospectOrganization.attributes['identityNumber'];
              creditAgreement.body.prospectOrganization.koreanIdNumber =
                creditAgreement.body.prospectOrganization.attributes['koreanIdNumber'];
              creditAgreement.body.prospectOrganization.lineOfBusinessId =
                creditAgreement.body.prospectOrganization.attributes['lineOfBusinessId'];
              creditAgreement.body.prospectOrganization.notaryName = creditAgreement.body.prospectOrganization.attributes['notaryName'];
              creditAgreement.body.prospectOrganization.npwp = creditAgreement.body.prospectOrganization.attributes['npwp'];
              creditAgreement.body.prospectOrganization.otherName = creditAgreement.body.prospectOrganization.attributes['otherName'];
              creditAgreement.body.prospectOrganization.pepId = creditAgreement.body.prospectOrganization.attributes['pepId'];
              creditAgreement.body.prospectOrganization.pic = creditAgreement.body.prospectOrganization.attributes['pic'];
              creditAgreement.body.prospectOrganization.riskProfileId =
                creditAgreement.body.prospectOrganization.attributes['riskProfileId'];
            }

            return of(creditAgreement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICreditAgreement>) => res.body),
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
    const newItem = new CreditAgreement();
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

export const creditAgrementReviewRoute: Routes = [
  {
    path: '',
    component: CreditAgreementComponent,
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
    path: ':id/edit',
    component: CreditAgreementDetailComponent,
    resolve: {
      content: CreditAgreementReviewResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  // {
  //   path: ':id/edit',
  //   component: ProposalBasicInformationComponent,
  //   resolve: {
  //     content: CreditProposalResolve,
  //   },
  //   canActivate: [UserRouteAccessService],
  // },

  {
    path: ':id/:managementType/detailFiles',
    component: DebtorDataSlikSummaryDebiturViewComponent,
    resolve: {
      content: CreditAgreementReviewResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
      managementType: ['_managementType'],
    },
    canActivate: [UserRouteAccessService],
  },
];

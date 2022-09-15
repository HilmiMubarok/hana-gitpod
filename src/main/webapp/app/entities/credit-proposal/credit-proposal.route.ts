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

import { CreditProposalListComponent } from './credit-proposal-list.component';
import { ProposalBasicInformationComponent } from './proposal-basic-information.component';
import lodash from 'lodash';
import { AnalysisOfCalculation, ProformaLaporanKeuangan } from './financial-statement/financial-statement.constant';
import { BasicInformation } from './basic-information/basic-information.model';
import { BusinessActivity } from './busines-activity/busines-activity.model';
import { Guarantour } from './guarantour/guarantour.model';
import { TradeChecking } from './trade-checking/trade-checking.model';
import { Covenant } from './convenant/convenant.constant';
import { RisksAcceptenceCriteria } from './risk-criteria/risk-criteria.model';
import { ProspectPerson } from './basic-prospect-person/prospect-person.model';

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
            if (creditProposal.body.collaterals.length > 0) {
              for (let i = 0; i < creditProposal.body.collaterals.length; i++) {
                if (!lodash.has(creditProposal.body.collaterals[i].attributes, 'notes')) {
                  creditProposal.body.collaterals[i].attributes['notes'] = '';
                }

                if (!lodash.has(creditProposal.body.collaterals[i].attributes, 'crossCollateral')) {
                  creditProposal.body.collaterals[i].attributes['crossCollateral'] = '';
                }
              }
            }

            if (!lodash.has(creditProposal.body.attributes, 'insurance')) {
              creditProposal.body.attributes['insurance'] = [];
            } else {
              creditProposal.body.attributes['insurance'] = JSON.parse(creditProposal.body.attributes['insurance']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'binding')) {
              creditProposal.body.attributes['binding'] = [];
            } else {
              creditProposal.body.attributes['binding'] = JSON.parse(creditProposal.body.attributes['binding']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'businessGroup')) {
              creditProposal.body.attributes['businessGroup'] = [];
            } else {
              creditProposal.body.attributes['businessGroup'] = JSON.parse(creditProposal.body.attributes['businessGroup']);
            }

            if (!lodash.has(creditProposal.body.debtorData.attributes, 'prospectPerson')) {
              creditProposal.body.debtorData.attributes['prospectPerson'] = new ProspectPerson();
            } else {
              creditProposal.body.debtorData.attributes['prospectPerson'] = JSON.parse(
                creditProposal.body.debtorData.attributes['prospectPerson']
              );
            }

            // Slik Share Holder
            if (!lodash.has(creditProposal.body.attributes, 'shareHolder')) {
              creditProposal.body.attributes['shareHolder'] = [];
            } else {
              creditProposal.body.attributes['shareHolder'] = JSON.parse(creditProposal.body.attributes['shareHolder']);
            }

            // Correspondence
            if (!lodash.has(creditProposal.body.attributes, 'correspondence')) {
              creditProposal.body.attributes['correspondence'] = [];
            } else {
              creditProposal.body.attributes['correspondence'] = JSON.parse(creditProposal.body.attributes['correspondence']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'basicInformation')) {
              creditProposal.body.attributes['basicInformation'] = new BasicInformation();
            } else {
              creditProposal.body.attributes['basicInformation'] = JSON.parse(creditProposal.body.attributes['basicInformation']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'riksCriteria')) {
              creditProposal.body.attributes['riksCriteria'] = new RisksAcceptenceCriteria();
            } else {
              creditProposal.body.attributes['riksCriteria'] = JSON.parse(creditProposal.body.attributes['riksCriteria']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'businessActivity')) {
              creditProposal.body.attributes['businessActivity'] = new BusinessActivity();
            } else {
              creditProposal.body.attributes['businessActivity'] = JSON.parse(creditProposal.body.attributes['businessActivity']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'tradeChecking')) {
              creditProposal.body.attributes['tradeChecking'] = new TradeChecking();
            } else {
              creditProposal.body.attributes['tradeChecking'] = JSON.parse(creditProposal.body.attributes['tradeChecking']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'guaranturAnalysis')) {
              creditProposal.body.attributes['guaranturAnalysis'] = new Guarantour();
            } else {
              creditProposal.body.attributes['guaranturAnalysis'] = JSON.parse(creditProposal.body.attributes['guaranturAnalysis']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'convenant')) {
              creditProposal.body.attributes['convenant'] = new Covenant();
            } else {
              creditProposal.body.attributes['convenant'] = JSON.parse(creditProposal.body.attributes['convenant']);
            }

            // bank analyst
            if (!lodash.has(creditProposal.body.attributes, 'bankAnalyst')) {
              creditProposal.body.attributes['bankAnalyst'] = [];
            } else {
              creditProposal.body.attributes['bankAnalyst'] = JSON.parse(creditProposal.body.attributes['bankAnalyst']);
            }

            // analysis of calculation
            if (!lodash.has(creditProposal.body.attributes, 'analysisOfCalculation')) {
              creditProposal.body.attributes['analysisOfCalculation'] = new AnalysisOfCalculation();
            } else {
              creditProposal.body.attributes['analysisOfCalculation'] = JSON.parse(creditProposal.body.attributes['analysisOfCalculation']);
            }

            // proforma laporan keuangan
            if (!lodash.has(creditProposal.body.attributes, 'proformaLaporanKeuangan')) {
              creditProposal.body.attributes['proformaLaporanKeuangan'] = [];
              creditProposal.body.attributes['proformaLaporanKeuangan'].push(new ProformaLaporanKeuangan());
              creditProposal.body.attributes['proformaLaporanKeuangan'].push(new ProformaLaporanKeuangan());
            } else {
              creditProposal.body.attributes['proformaLaporanKeuangan'] = JSON.parse(
                creditProposal.body.attributes['proformaLaporanKeuangan']
              );
            }

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
    path: 'list/:id/edit',
    component: ProposalBasicInformationComponent,
    resolve: {
      content: CreditProposalResolve,
    },
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProposalBasicInformationComponent,
    resolve: {
      content: CreditProposalResolve,
    },
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
    path: 'list',
    component: CreditProposalListComponent,
    canActivate: [UserRouteAccessService],
  },
];

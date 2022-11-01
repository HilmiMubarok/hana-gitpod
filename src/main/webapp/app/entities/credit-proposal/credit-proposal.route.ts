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
import { AnalysisOfCalculation, ProformaLaporanKeuangan } from './financial-statement/financial-statement.constant';
import { BasicInformation } from './basic-information/basic-information.model';
import { BusinessActivity } from './busines-activity/busines-activity.model';
import { Guarantour } from './guarantour/guarantour.model';
import { Covenant } from './convenant/convenant.constant';
import { RisksAcceptenceCriteria } from './risk-criteria/risk-criteria.model';
import { ProspectPerson } from './basic-prospect-person/prospect-person.model';
import {
  IRepaymentCapability,
  IRepaymentCapabilityDetail,
  RepaymentCapability,
} from './repayment-capability/repayment-capability.constant';
import { Facility } from './facility/facility.model';
import { TabCustomerProfitability } from './tab-customer-profitability/tab-customert-profitability.model';
import { CreditProposalNewComponent } from './credit-proposal-new.component';
import { CreditProposalListMaterialComponent } from './credit-proposal-list-material.component';
import { CreditManagementInfo } from './credit-proposal-tab-management-info.model';

import { CreditProposalCollateralInfoChecklistComponent } from './collateral-info/checklist/credit-proposal-collateral-info-checklist.component';
import { CollateralInfoChecklist } from './collateral-info/checklist/collateral-info-checklist.model';
import { CreditTabSummary } from './credit-proposal-tab-summary.model';
import { PurposePricing } from './propose-pricing/purpose-pricing.model';
import { CpRacBack } from './risk-criteria/back-to-back/credit-proposal-risk-acceptance-back.model';
import { CpRacBelow } from './risk-criteria/below/risk-criteria-below.model';
import { IndustryLimit } from './exposure/industry-limit/industry-limit.model';

import lodash from 'lodash';
import { ComplienceRecommendation } from '../loan-analys/compliance/complience.model';
import { OfferingLetter, OfferingLetterPreparation } from '../offering-letter/offering-page/offering-page.model';
import { CreditProposalCollateralData } from './collateral-info/credit-proposal-collateral-info.model';

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

                if (!lodash.has(creditProposal.body.collaterals[i].attributes, 'bindingValue')) {
                  creditProposal.body.collaterals[i].attributes['bindingValue'] = '';
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

            if (!lodash.has(creditProposal.body.attributes, 'shareHolder')) {
              creditProposal.body.attributes['shareHolder'] = [];
            } else {
              creditProposal.body.attributes['shareHolder'] = JSON.parse(creditProposal.body.attributes['shareHolder']);
            }

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

            if (!lodash.has(creditProposal.body.attributes, 'bankAnalyst')) {
              creditProposal.body.attributes['bankAnalyst'] = [];
            } else {
              creditProposal.body.attributes['bankAnalyst'] = JSON.parse(creditProposal.body.attributes['bankAnalyst']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'analysisOfCalculation')) {
              creditProposal.body.attributes['analysisOfCalculation'] = new AnalysisOfCalculation();
            } else {
              creditProposal.body.attributes['analysisOfCalculation'] = JSON.parse(creditProposal.body.attributes['analysisOfCalculation']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'proformaLaporanKeuangan')) {
              creditProposal.body.attributes['proformaLaporanKeuangan'] = [];
              creditProposal.body.attributes['proformaLaporanKeuangan'].push(new ProformaLaporanKeuangan());
              creditProposal.body.attributes['proformaLaporanKeuangan'].push(new ProformaLaporanKeuangan());
            } else {
              creditProposal.body.attributes['proformaLaporanKeuangan'] = JSON.parse(
                creditProposal.body.attributes['proformaLaporanKeuangan']
              );
            }

            if (!lodash.has(creditProposal.body.attributes, 'proposalType')) {
              creditProposal.body.attributes['proposalType'] = '';
            }

            if (!lodash.has(creditProposal.body.attributes, 'repaymentCapability')) {
              creditProposal.body.attributes['repaymentCapability'] = [];
              creditProposal.body.attributes['repaymentCapability'].push(new RepaymentCapability());
            } else {
              creditProposal.body.attributes['repaymentCapability'] = JSON.parse(creditProposal.body.attributes['repaymentCapability']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'facilityDetail')) {
              creditProposal.body.attributes['facilityDetail'] = new Facility();
            } else {
              creditProposal.body.attributes['facilityDetail'] = JSON.parse(creditProposal.body.attributes['facilityDetail']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'tabCustomer')) {
              creditProposal.body.attributes['tabCustomer'] = new TabCustomerProfitability();
            } else {
              creditProposal.body.attributes['tabCustomer'] = JSON.parse(creditProposal.body.attributes['tabCustomer']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'tradeCheckingSupplier')) {
              creditProposal.body.attributes['tradeCheckingSupplier'] = [];
            } else {
              creditProposal.body.attributes['tradeCheckingSupplier'] = JSON.parse(creditProposal.body.attributes['tradeCheckingSupplier']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'tradeCheckingBuyers')) {
              creditProposal.body.attributes['tradeCheckingBuyers'] = [];
            } else {
              creditProposal.body.attributes['tradeCheckingBuyers'] = JSON.parse(creditProposal.body.attributes['tradeCheckingBuyers']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'collateralChecklist')) {
              creditProposal.body.attributes['collateralChecklist'] = new CollateralInfoChecklist();
            } else {
              creditProposal.body.attributes['collateralChecklist'] = JSON.parse(creditProposal.body.attributes['collateralChecklist']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'managementInfo')) {
              creditProposal.body.attributes['managementInfo'] = new CreditManagementInfo();
            } else {
              creditProposal.body.attributes['managementInfo'] = JSON.parse(creditProposal.body.attributes['managementInfo']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'tabSummaryMessage')) {
              creditProposal.body.attributes['tabSummaryMessage'] = new CreditTabSummary();
            } else {
              creditProposal.body.attributes['tabSummaryMessage'] = JSON.parse(creditProposal.body.attributes['tabSummaryMessage']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'purposePricing')) {
              creditProposal.body.attributes['purposePricing'] = new PurposePricing();
            } else {
              creditProposal.body.attributes['purposePricing'] = JSON.parse(creditProposal.body.attributes['purposePricing']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'creditProposalCollateralData')) {
              creditProposal.body.attributes['creditProposalCollateralData'] = new CreditProposalCollateralData();
            } else {
              creditProposal.body.attributes['creditProposalCollateralData'] = JSON.parse(
                creditProposal.body.attributes['creditProposalCollateralData']
              );
            }

            if (!lodash.has(creditProposal.body.attributes, 'cpRacBelow')) {
              creditProposal.body.attributes['cpRacBelow'] = new CpRacBelow();
            } else {
              creditProposal.body.attributes['cpRacBelow'] = JSON.parse(creditProposal.body.attributes['cpRacBelow']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'cpRacBack')) {
              creditProposal.body.attributes['cpRacBack'] = new CpRacBack();
            } else {
              creditProposal.body.attributes['cpRacBack'] = JSON.parse(creditProposal.body.attributes['cpRacBack']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'emptyField')) {
              creditProposal.body.attributes['emptyField'] = [];
            } else {
              creditProposal.body.attributes['emptyField'] = JSON.parse(creditProposal.body.attributes['emptyField']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'collateralPrevious')) {
              creditProposal.body.attributes['collateralPrevious'] = [];
            } else {
              creditProposal.body.attributes['collateralPrevious'] = JSON.parse(creditProposal.body.attributes['collateralPrevious']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'facilityTakeOver')) {
              creditProposal.body.attributes['facilityTakeOver'] = [];
            } else {
              creditProposal.body.attributes['facilityTakeOver'] = JSON.parse(creditProposal.body.attributes['facilityTakeOver']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'facilityTakeOverAfterBank')) {
              creditProposal.body.attributes['facilityTakeOverAfterBank'] = [];
            } else {
              creditProposal.body.attributes['facilityTakeOverAfterBank'] = JSON.parse(
                creditProposal.body.attributes['facilityTakeOverAfterBank']
              );
            }

            if (!lodash.has(creditProposal.body.attributes, 'complienceReccomendation')) {
              creditProposal.body.attributes['complienceReccomendation'] = new ComplienceRecommendation();
            } else {
              creditProposal.body.attributes['complienceReccomendation'] = JSON.parse(
                creditProposal.body.attributes['complienceReccomendation']
              );
            }

            if (!lodash.has(creditProposal.body.attributes, 'industryLimit')) {
              creditProposal.body.attributes['industryLimit'] = new IndustryLimit();
            } else {
              creditProposal.body.attributes['industryLimit'] = JSON.parse(creditProposal.body.attributes['industryLimit']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'offeringLetter')) {
              creditProposal.body.attributes['offeringLetter'] = [];
            } else {
              creditProposal.body.attributes['offeringLetter'] = JSON.parse(creditProposal.body.attributes['offeringLetter']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'previous')) {
              creditProposal.body.attributes['previous'] = [];
            } else {
              creditProposal.body.attributes['previous'] = JSON.parse(creditProposal.body.attributes['previous']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'offeringLetterPreparation')) {
              creditProposal.body.attributes['offeringLetterPreparation'] = new OfferingLetterPreparation();
            } else {
              creditProposal.body.attributes['offeringLetterPreparation'] = JSON.parse(
                creditProposal.body.attributes['offeringLetterPreparation']
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
    component: CreditProposalListMaterialComponent,
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
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditProposalNewComponent,
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

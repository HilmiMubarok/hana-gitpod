import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { CreditProposalResolve } from '../../../credit-proposal/credit-proposal.route';

import { ICreditProposal, CreditProposal } from '../../../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../../../credit-proposal/credit-proposal.service';
import { OfferingLetterComponent } from 'app/entities/offering-letter/offering-letter.component';
import { OfferingLetterMainComponent } from 'app/entities/offering-letter/offering-letter-main.component';

import lodash from 'lodash';

import { ProspectPerson } from '../../../credit-proposal/basic-prospect-person/prospect-person.model';
import { BasicInformation } from '../../../credit-proposal/basic-information/basic-information.model';
import { RisksAcceptenceCriteria } from '../../../credit-proposal/risk-criteria/risk-criteria.model';
import { BusinessActivity } from '../../../credit-proposal/busines-activity/busines-activity.model';
import { Guarantour } from '../../../credit-proposal/guarantour/guarantour.model';
import { Covenant } from '../../../credit-proposal/convenant/convenant.constant';
import { AnalysisOfCalculation, ProformaLaporanKeuangan } from '../../../credit-proposal/financial-statement/financial-statement.constant';
import { RepaymentCapability } from '../../../credit-proposal/repayment-capability/repayment-capability.constant';
import { Facility } from '../../../credit-proposal/facility/facility.model';
import { TabCustomerProfitability } from '../../../credit-proposal/tab-customer-profitability/tab-customert-profitability.model';
import { CollateralInfoChecklist } from '../../../credit-proposal/collateral-info/checklist/collateral-info-checklist.model';
import { CreditTabSummary } from '../../../credit-proposal/credit-proposal-tab-summary.model';
import { CreditManagementInfo } from '../../../credit-proposal/credit-proposal-tab-management-info.model';
import { PurposePricing } from '../../../credit-proposal/propose-pricing/purpose-pricing.model';
import { CpRacBack } from '../../../credit-proposal/risk-criteria/back-to-back/credit-proposal-risk-acceptance-back.model';
import { CpRacBelow } from '../../../credit-proposal/risk-criteria/below/risk-criteria-below.model';
import { OfferingLetter, OfferingLetterPreparation } from 'app/entities/offering-letter/offering-page/offering-page.model';
import { BankAccountAnalystMessage } from '../../../credit-proposal/bank-account-analyst/bank-account-analyst.model';
import { ComplienceRecommendation } from '../../../loan-analys/compliance/complience.model';
import { RejectReason } from '../../../credit-proposal/forward-to/reject-to.model';
import { LegalLendingLimit } from '../../../credit-proposal/exposure/legal-lending/legal-lending-limit.model';
import { DocumentData } from '../../../loan-analys/assign-to/assign.model';
import { HistoryProposalComponent } from './history-poposal.component';
import { CollateralSummary } from 'app/entities/credit-proposal/collateral-info/collateral-summary/collateral-summary-total.model';
import {
  CreditProposalCollateralData,
  CoverageTotal,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { GroupCollateralTotal } from 'app/entities/credit-proposal/collateral-info/group-collateral/group-collateral-total.model';
import { IndustryLimit } from 'app/entities/credit-proposal/exposure/industry-limit/industry-limit.model';
import { CalculationExposure } from 'app/entities/credit-proposal/exposure/total-exposure/calculation-exposure.model';
import { FinancialState } from 'app/entities/credit-proposal/repayment-spreadsheet/remarks/financial-statement-remarks.model';
import { CheckRemarks } from 'app/entities/credit-proposal/trade-checking/Remarks/remarks.model';

@Injectable({ providedIn: 'root' })
export class OfferingLetterResolve implements Resolve<ICreditProposal> {
  constructor(private service: CreditProposalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditProposal> | Observable<never> {
    const useTemplate = 'default';
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

            if (!lodash.has(creditProposal.body.attributes, 'tabSummaryMessage')) {
              creditProposal.body.attributes['tabSummaryMessage'] = new CreditTabSummary();
            } else {
              creditProposal.body.attributes['tabSummaryMessage'] = JSON.parse(creditProposal.body.attributes['tabSummaryMessage']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'managementInfo')) {
              creditProposal.body.attributes['managementInfo'] = new CreditManagementInfo();
            } else {
              creditProposal.body.attributes['managementInfo'] = JSON.parse(creditProposal.body.attributes['managementInfo']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'purposePricing')) {
              creditProposal.body.attributes['purposePricing'] = new PurposePricing();
            } else {
              creditProposal.body.attributes['purposePricing'] = JSON.parse(creditProposal.body.attributes['purposePricing']);
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

            // Complience Rec
            if (!lodash.has(creditProposal.body.attributes, 'complienceReccomendation')) {
              creditProposal.body.attributes['complienceReccomendation'] = new ComplienceRecommendation();
            } else {
              creditProposal.body.attributes['complienceReccomendation'] = JSON.parse(
                creditProposal.body.attributes['complienceReccomendation']
              );
            }
            // Collateral
            if (!lodash.has(creditProposal.body.attributes, 'collateralPrevious')) {
              creditProposal.body.attributes['collateralPrevious'] = [];
            } else {
              creditProposal.body.attributes['collateralPrevious'] = JSON.parse(creditProposal.body.attributes['collateralPrevious']);
            }
            // TakeOver
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

            if (!lodash.has(creditProposal.body.attributes, 'retriveData')) {
              creditProposal.body.attributes['retriveData'] = [];
            } else {
              creditProposal.body.attributes['retriveData'] = JSON.parse(creditProposal.body.attributes['retriveData']);
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
            if (!lodash.has(creditProposal.body.attributes, 'rejectReason')) {
              creditProposal.body.attributes['rejectReason'] = new RejectReason();
            } else {
              creditProposal.body.attributes['rejectReason'] = JSON.parse(creditProposal.body.attributes['rejectReason']);
            }
            if (!lodash.has(creditProposal.body.attributes, 'legalLendingLimit')) {
              creditProposal.body.attributes['legalLendingLimit'] = new LegalLendingLimit();
            } else {
              creditProposal.body.attributes['legalLendingLimit'] = JSON.parse(creditProposal.body.attributes['legalLendingLimit']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'lendingProgramParameter')) {
              creditProposal.body.attributes['lendingProgramParameter'] = [];
            } else {
              creditProposal.body.attributes['lendingProgramParameter'] = JSON.parse(
                creditProposal.body.attributes['lendingProgramParameter']
              );
            }

            if (!lodash.has(creditProposal.body.attributes, 'approvalStatus')) {
              creditProposal.body.attributes['approvalStatus'] = [];
            } else {
              creditProposal.body.attributes['approvalStatus'] = JSON.parse(creditProposal.body.attributes['approvalStatus']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'dataAssignTo')) {
              creditProposal.body.attributes['dataAssignTo'] = [];
              creditProposal.body.attributes['dataAssignTo'].push(new DocumentData());
            } else {
              creditProposal.body.attributes['dataAssignTo'] = JSON.parse(creditProposal.body.attributes['dataAssignTo']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'dataAssignToCRO')) {
              creditProposal.body.attributes['dataAssignToCRO'] = [];
              creditProposal.body.attributes['dataAssignToCRO'].push(new DocumentData());
            } else {
              creditProposal.body.attributes['dataAssignToCRO'] = JSON.parse(creditProposal.body.attributes['dataAssignToCRO']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'dataAssignToCCAdmin')) {
              creditProposal.body.attributes['dataAssignToCCAdmin'] = [];
              creditProposal.body.attributes['dataAssignToCCAdmin'].push(new DocumentData());
            } else {
              creditProposal.body.attributes['dataAssignToCCAdmin'] = JSON.parse(creditProposal.body.attributes['dataAssignToCCAdmin']);
            }

            if (!lodash.has(creditProposal.body.attributes, 'dataAssignToLegalOfficer')) {
              creditProposal.body.attributes['dataAssignToLegalOfficer'] = [];
              creditProposal.body.attributes['dataAssignToLegalOfficer'].push(new DocumentData());
            } else {
              creditProposal.body.attributes['dataAssignToLegalOfficer'] = JSON.parse(
                creditProposal.body.attributes['dataAssignToLegalOfficer']
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
    return of(newItem);
  }
}

export const OfferingLetterRoute: Routes = [
  // {
  //   path: '',
  //   component: OfferingLetterComponent,
  //   data: {
  //     authorities: ['ROLE_USER'],
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  {
    path: ':id/edit',
    component: HistoryProposalComponent,
    resolve: {
      offeringLetter: CreditProposalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

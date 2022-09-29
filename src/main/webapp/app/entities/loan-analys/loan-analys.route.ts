import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';
import lodash from 'lodash';
import { ProspectPerson } from '../credit-proposal/basic-prospect-person/prospect-person.model';
import { BasicInformation } from '../credit-proposal/basic-information/basic-information.model';
import { RisksAcceptenceCriteria } from '../credit-proposal/risk-criteria/risk-criteria.model';
import { BusinessActivity } from '../credit-proposal/busines-activity/busines-activity.model';
import { Guarantour } from '../credit-proposal/guarantour/guarantour.model';
import { Covenant } from '../credit-proposal/convenant/convenant.constant';
import { AnalysisOfCalculation, ProformaLaporanKeuangan } from '../credit-proposal/financial-statement/financial-statement.constant';
import { RepaymentCapability } from '../credit-proposal/repayment-capability/repayment-capability.constant';
import { OpinionHistory } from '../credit-proposal/opinion-history/opinion-history.model';
import { Facility } from '../credit-proposal/facility/facility.model';
import { TabCustomerProfitability } from '../credit-proposal/tab-customer-profitability/tab-customert-profitability.model';

@Injectable({ providedIn: 'root' })
export class LoanAnalysResolve implements Resolve<ICreditProposal> {
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

            if (!lodash.has(creditProposal.body.attributes, 'proposalType')) {
              creditProposal.body.attributes['proposalType'] = '';
            }

            if (!lodash.has(creditProposal.body.attributes, 'repaymentCapability')) {
              creditProposal.body.attributes['repaymentCapability'] = [];
              creditProposal.body.attributes['repaymentCapability'].push(new RepaymentCapability());
            } else {
              creditProposal.body.attributes['repaymentCapability'] = JSON.parse(creditProposal.body.attributes['repaymentCapability']);
            }

            if (!lodash.has(creditProposal.body.notes, 'opinionHistory')) {
              const tempTemplateOpinionHistory = {
                opinionHistory: new OpinionHistory(),
              };
              creditProposal.body.notes.push(tempTemplateOpinionHistory);
            } else {
              creditProposal.body.notes['opinionHistory'] = JSON.parse(creditProposal.body.notes['opinionHistory']);
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

            // Buyers
            if (!lodash.has(creditProposal.body.attributes, 'tradeCheckingBuyers')) {
              creditProposal.body.attributes['tradeCheckingBuyers'] = [];
            } else {
              creditProposal.body.attributes['tradeCheckingBuyers'] = JSON.parse(creditProposal.body.attributes['tradeCheckingBuyers']);
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

export const LoanAnalysRoute: Routes = [
  {
    path: '',
    component: LoanAnalysComponent,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/single-assign',
    component: LoanAnalysMainComponent,
    resolve: {
      loanAnalys: CreditProposalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'batch-bulk-assign',
    component: LoanAnalysBatchBulkAssignComponent,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

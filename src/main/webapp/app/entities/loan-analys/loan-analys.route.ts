// import { Injectable } from '@angular/core';
// import { HttpResponse } from '@angular/common/http';
// import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

// import { Observable, of, EMPTY } from 'rxjs';
// import { map, mergeMap } from 'rxjs/operators';

// import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

// import { ICreditProposal, CreditProposal } from '../credit-proposal/credit-proposal.model';
// import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';

/* @Injectable({ providedIn: 'root' })
export class LoanAnalysResolve implements Resolve<ICreditProposal> {
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
    return of(newItem);
  }
} */

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
    path: ':id/assign',
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
    component: LoanAnalysBulkAssignComponent,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

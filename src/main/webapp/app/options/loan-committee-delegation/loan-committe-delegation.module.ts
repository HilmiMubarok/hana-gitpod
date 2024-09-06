import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanCommitteeDelegationComponent } from './loan-committe-delegation.component';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoleAdminAccessService } from 'app/core/auth/role-admin-access.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { LoanCommitteeDelegationDetailComponent } from './detail/loan-committee-delegation-detail.component';

const correctionApplicationRoute: Routes = [
  {
    path: '',
    component: LoanCommitteeDelegationComponent,
    canActivate: [UserRouteAccessService, RoleAdminAccessService],
    data: {
      pageTitle: 'Loan Committee Delegation',
    },
  },
  {
    path: ':id/edit',
    component: LoanCommitteeDelegationDetailComponent,
    data: {
      pageTitle: 'Loan Committee Delegation',
    },
    canActivate: [UserRouteAccessService, RoleAdminAccessService],
  },
];

@NgModule({
  declarations: [LoanCommitteeDelegationComponent, LoanCommitteeDelegationDetailComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule, RouterModule.forChild(correctionApplicationRoute)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoanCommitteeDelegationModule {}

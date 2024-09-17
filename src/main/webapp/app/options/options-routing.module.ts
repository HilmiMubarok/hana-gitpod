import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    SharedModule,
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'correction-application',
        loadChildren: () => import('./correction-application/correction-application.module').then(m => m.CorrectionApplicationAppModule),
      },
      {
        path: 'correction-appraisal',
        loadChildren: () => import('./correction-appraisal/correction-appraisal.module').then(m => m.CorrectionAppraisalAppModule),
      },
      {
        path: 'loan-committee-delegation',
        loadChildren: () =>
          import('./loan-committee-delegation/loan-committe-delegation.module').then(m => m.LoanCommitteeDelegationModule),
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class OptionsRoutingModule {}

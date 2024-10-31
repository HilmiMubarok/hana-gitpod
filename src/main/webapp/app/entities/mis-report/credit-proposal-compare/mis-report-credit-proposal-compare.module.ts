import { NgModule } from '@angular/core';
import { MisCreditProposalReportCompareComponent } from './mis-creditproposal-report-compare.component';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: MisCreditProposalReportCompareComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisCreditProposalReportCompareComponent],
  providers: [],
  exports: [],
})
export class MisCreditProposalReportCompareModule {}

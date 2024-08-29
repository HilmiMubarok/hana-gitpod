import { NgModule } from '@angular/core';
import { MisCreditProposalReportComponent } from './mis-creditproposal-report.component';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';

const route: Routes = [
  {
    path: '',
    component: MisCreditProposalReportComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisCreditProposalReportComponent],
  providers: [],
  exports: [],
})
export class MisCreditProposalReportModule {}

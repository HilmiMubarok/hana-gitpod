import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisApplicationTrackingReportComponent } from './mis-application-tracking-report.component';

const route: Routes = [
  {
    path: '',
    component: MisApplicationTrackingReportComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisApplicationTrackingReportComponent],
  providers: [],
  exports: [],
})
export class MisApplicationTrackingReportModule {}

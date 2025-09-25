import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisCpslaReviewerReportComponent } from './mis-cpslareviewer-report.component';

const routes: Routes = [
  {
    path: '',
    component: MisCpslaReviewerReportComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.slaReviewer.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [MisCpslaReviewerReportComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MisCpslaReviewerReportModule {}

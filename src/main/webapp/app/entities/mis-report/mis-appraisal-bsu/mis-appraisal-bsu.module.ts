import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisAppraisalBsuComponent } from './mis-appraisal-bsu.component';

const route: Routes = [
  {
    path: '',
    component: MisAppraisalBsuComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisAppraisalBsuComponent],
  providers: [],
  exports: [],
})
export class MisAppraisalBsuModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisAppraisalComponent } from './mis-appraisal.component';

const route: Routes = [
  {
    path: '',
    component: MisAppraisalComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisAppraisalComponent],
  providers: [],
  exports: [],
})
export class MisAppraisalModule {}

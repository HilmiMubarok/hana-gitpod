import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisSummaryProductivityYearlyComponent } from './mis-summary-productivity-yearly.component';
import { MisMonthlyComponent } from './mis-monthly.component';
import { MisYearlyComponent } from './mis-yearly.component';

const route: Routes = [
  {
    path: '',
    component: MisSummaryProductivityYearlyComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisSummaryProductivityYearlyComponent, MisYearlyComponent, MisMonthlyComponent],
  providers: [],
  exports: [],
})
export class MisSummaryProductivityYearlyModule {}

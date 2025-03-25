import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisDashboardModule } from '../mis-dashboard/mis-dashboard.module';
import { MisDashboardCredamDepartmentComponent } from './dashboard-main-credam-department.component';
import { MisDashboardInsuranceComponent } from './dashboard/credit-insurance/dashboard-sla-insurance.component';

const routes: Routes = [
  {
    path: '',
    component: MisDashboardCredamDepartmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.slaReviewer.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, MisDashboardModule, RouterModule.forChild(routes)],
  declarations: [MisDashboardCredamDepartmentComponent, MisDashboardInsuranceComponent],
})
export class MisDashboardCredamDepartmentModule {}

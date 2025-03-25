import { Component, NgModule } from '@angular/core';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardCredamComponent } from './dashboard-credam.component';
import { NgChartsModule } from 'ng2-charts';
const cpfRoute: Routes = [
  {
    path: '',
    component: DashboardCredamComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
  {
    path: 'dashboard-credam',
    component: DashboardCredamComponent,
    canActivate: [UserRouteAccessService],
  },
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(cpfRoute), NgChartsModule],
  declarations: [DashboardCredamComponent],
  providers: [],
  exports: [],
})
export class DashboardCredamModule {}

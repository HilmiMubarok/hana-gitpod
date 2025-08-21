import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardLegalComponent } from './dashboard-legal.component';
import { YearlyReportComponent } from './yearly-report/yearly-report.component';
import { SharedModule } from 'app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisDashboardModule } from '../mis-dashboard/mis-dashboard.module';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { WeeklyDataUpdateComponent } from './weekly-data-update/weekly-data-update.component';
import { NgChartsModule } from 'ng2-charts';
import { DataPicComponent } from './data-pic/data-pic.component';
import { SegmentationDataReportComponent } from './segmentation-data-report/segmentation-data-report.component';
import { DpdlDataComponent } from './dpdl-data/dpdl-data.component';
import { CreditNominalDataComponent } from './credit-nominal-data/credit-nominal-data.component';
import { StatusAkadComponent } from './status-akad/status-akad-report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLegalComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.slaReviewer.home.title',
    },
  },
];

@NgModule({
  declarations: [
    DashboardLegalComponent,
    YearlyReportComponent,
    WeeklyReportComponent,
    WeeklyDataUpdateComponent,
    DataPicComponent,
    SegmentationDataReportComponent,
    DpdlDataComponent,
    CreditNominalDataComponent,
    StatusAkadComponent,
  ],
  imports: [SharedModule, MisDashboardModule, RouterModule.forChild(routes), NgChartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardLegalModule {}

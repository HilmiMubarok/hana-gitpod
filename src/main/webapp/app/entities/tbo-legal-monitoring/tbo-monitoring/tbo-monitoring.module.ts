import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TboLegalMonitoringViewComponent } from './dialog/tbo-legal-monitoring-view.component';
import { TboLegalMonitoringDetailComponent } from './dialog/tbo-legal-monitoring-detail.component';

@NgModule({
  imports: [SharedModule],
  declarations: [TboLegalMonitoringViewComponent, TboLegalMonitoringDetailComponent],
  exports: [TboLegalMonitoringViewComponent, TboLegalMonitoringDetailComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class TboMonitoringModule {}

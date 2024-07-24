import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PeriodComponent } from './period.component';
import { PeriodDetailComponent } from './period-detail.component';
import { PeriodUpdateComponent } from './period-update.component';
import { periodRoute } from './period.route';
import { PeriodViewComponent } from './period-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(periodRoute)],
  declarations: [PeriodComponent, PeriodDetailComponent, PeriodUpdateComponent, PeriodViewComponent],
  entryComponents: [PeriodComponent, PeriodUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPeriodModule {}

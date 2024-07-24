import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PeriodTypeComponent } from './period-type.component';
import { PeriodTypeDetailComponent } from './period-type-detail.component';
import { PeriodTypeUpdateComponent } from './period-type-update.component';
import { periodTypeRoute } from './period-type.route';
import { PeriodTypeViewComponent } from './period-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(periodTypeRoute)],
  declarations: [PeriodTypeComponent, PeriodTypeDetailComponent, PeriodTypeUpdateComponent, PeriodTypeViewComponent],
  entryComponents: [PeriodTypeComponent, PeriodTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPeriodTypeModule {}

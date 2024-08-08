import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PeriodComponent } from './period.component';
import { PeriodDetailComponent } from './period-detail.component';
import { PeriodUpdateComponent } from './period-update.component';
import { periodRoute } from './period.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(periodRoute)],
  declarations: [PeriodComponent, PeriodDetailComponent, PeriodUpdateComponent],
  entryComponents: [PeriodComponent, PeriodUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPeriodModule {}

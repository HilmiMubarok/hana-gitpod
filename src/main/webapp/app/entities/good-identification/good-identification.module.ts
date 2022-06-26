import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GoodIdentificationComponent } from './good-identification.component';
import { GoodIdentificationDetailComponent } from './good-identification-detail.component';
import { GoodIdentificationUpdateComponent } from './good-identification-update.component';
import { goodIdentificationRoute } from './good-identification.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(goodIdentificationRoute)],
  declarations: [GoodIdentificationComponent, GoodIdentificationDetailComponent, GoodIdentificationUpdateComponent],
  entryComponents: [GoodIdentificationComponent, GoodIdentificationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGoodIdentificationModule {}

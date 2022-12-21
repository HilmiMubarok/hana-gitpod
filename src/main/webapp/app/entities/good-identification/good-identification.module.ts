import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { goodIdentificationRoute } from './good-identification.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(goodIdentificationRoute)],
  declarations: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGoodIdentificationModule {}

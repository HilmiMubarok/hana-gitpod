import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { partyCategoryTypeRoute } from './party-category-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyCategoryTypeRoute)],
  declarations: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCategoryTypeModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ReligionTypeComponent } from './religion-type.component';
import { ReligionTypeDetailComponent } from './religion-type-detail.component';
import { ReligionTypeUpdateComponent } from './religion-type-update.component';
import { religionTypeRoute } from './religion-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(religionTypeRoute)],
  declarations: [ReligionTypeComponent, ReligionTypeDetailComponent, ReligionTypeUpdateComponent],
  entryComponents: [ReligionTypeComponent, ReligionTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwReligionTypeModule {}

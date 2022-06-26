import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PurposeTypeComponent } from './purpose-type.component';
import { PurposeTypeDetailComponent } from './purpose-type-detail.component';
import { PurposeTypeUpdateComponent } from './purpose-type-update.component';
import { purposeTypeRoute } from './purpose-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(purposeTypeRoute)],
  declarations: [PurposeTypeComponent, PurposeTypeDetailComponent, PurposeTypeUpdateComponent],
  entryComponents: [PurposeTypeComponent, PurposeTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPurposeTypeModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { IdentificationTypeComponent } from './identification-type.component';
import { IdentificationTypeDetailComponent } from './identification-type-detail.component';
import { IdentificationTypeUpdateComponent } from './identification-type-update.component';
import { identificationTypeRoute } from './identification-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(identificationTypeRoute)],
  declarations: [IdentificationTypeComponent, IdentificationTypeDetailComponent, IdentificationTypeUpdateComponent],
  entryComponents: [IdentificationTypeComponent, IdentificationTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIdentificationTypeModule {}

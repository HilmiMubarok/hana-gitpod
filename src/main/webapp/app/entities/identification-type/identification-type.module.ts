import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { IdentificationTypeComponent } from './identification-type.component';
import { IdentificationTypeDetailComponent } from './identification-type-detail.component';
import { IdentificationTypeUpdateComponent } from './identification-type-update.component';
import { identificationTypeRoute } from './identification-type.route';
import { IdentificationTypeViewComponent } from './identification-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(identificationTypeRoute)],
  declarations: [
    IdentificationTypeComponent,
    IdentificationTypeDetailComponent,
    IdentificationTypeUpdateComponent,
    IdentificationTypeViewComponent,
  ],
  entryComponents: [IdentificationTypeComponent, IdentificationTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIdentificationTypeModule {}

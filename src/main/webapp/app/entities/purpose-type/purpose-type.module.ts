import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PurposeTypeComponent } from './purpose-type.component';
import { PurposeTypeDetailComponent } from './purpose-type-detail.component';
import { PurposeTypeUpdateComponent } from './purpose-type-update.component';
import { purposeTypeRoute } from './purpose-type.route';
import { PurposeTypeViewComponent } from './purpose-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(purposeTypeRoute)],
  declarations: [PurposeTypeComponent, PurposeTypeDetailComponent, PurposeTypeUpdateComponent, PurposeTypeViewComponent],
  entryComponents: [PurposeTypeComponent, PurposeTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPurposeTypeModule {}

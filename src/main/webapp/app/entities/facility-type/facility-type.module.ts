import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityTypeComponent } from './facility-type.component';
import { FacilityTypeDetailComponent } from './facility-type-detail.component';
import { FacilityTypeUpdateComponent } from './facility-type-update.component';
import { facilityTypeRoute } from './facility-type.route';
import { FacilityTypeViewComponent } from './facility-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(facilityTypeRoute)],
  declarations: [FacilityTypeComponent, FacilityTypeDetailComponent, FacilityTypeUpdateComponent, FacilityTypeViewComponent],
  entryComponents: [FacilityTypeComponent, FacilityTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFacilityTypeModule {}

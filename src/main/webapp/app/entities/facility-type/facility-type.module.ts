import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityTypeComponent } from './facility-type.component';
import { FacilityTypeDetailComponent } from './facility-type-detail.component';
import { FacilityTypeUpdateComponent } from './facility-type-update.component';
import { facilityTypeRoute } from './facility-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(facilityTypeRoute)],
  declarations: [FacilityTypeComponent, FacilityTypeDetailComponent, FacilityTypeUpdateComponent],
  entryComponents: [FacilityTypeComponent, FacilityTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFacilityTypeModule {}

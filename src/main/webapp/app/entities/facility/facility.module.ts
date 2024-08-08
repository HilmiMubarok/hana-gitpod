import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityComponent } from './facility.component';
import { FacilityDetailComponent } from './facility-detail.component';
import { FacilityUpdateComponent } from './facility-update.component';
import { facilityRoute } from './facility.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(facilityRoute)],
  declarations: [FacilityComponent, FacilityDetailComponent, FacilityUpdateComponent],
  entryComponents: [FacilityComponent, FacilityUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFacilityModule {}

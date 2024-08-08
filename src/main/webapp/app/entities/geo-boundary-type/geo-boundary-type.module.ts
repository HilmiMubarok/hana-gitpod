import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GeoBoundaryTypeComponent } from './geo-boundary-type.component';
import { GeoBoundaryTypeDetailComponent } from './geo-boundary-type-detail.component';
import { GeoBoundaryTypeUpdateComponent } from './geo-boundary-type-update.component';
import { geoBoundaryTypeRoute } from './geo-boundary-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(geoBoundaryTypeRoute)],
  declarations: [GeoBoundaryTypeComponent, GeoBoundaryTypeDetailComponent, GeoBoundaryTypeUpdateComponent],
  entryComponents: [GeoBoundaryTypeComponent, GeoBoundaryTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGeoBoundaryTypeModule {}

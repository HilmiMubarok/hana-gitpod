import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { GeoBoundaryTypeComponent } from './geo-boundary-type.component';
import { GeoBoundaryTypeDetailComponent } from './geo-boundary-type-detail.component';
import { GeoBoundaryTypeUpdateComponent } from './geo-boundary-type-update.component';
import { geoBoundaryTypeRoute } from './geo-boundary-type.route';
import { GeoBoundaryTypeViewComponent } from './geo-boundary-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(geoBoundaryTypeRoute)],
  declarations: [GeoBoundaryTypeComponent, GeoBoundaryTypeDetailComponent, GeoBoundaryTypeUpdateComponent, GeoBoundaryTypeViewComponent],
  entryComponents: [GeoBoundaryTypeComponent, GeoBoundaryTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGeoBoundaryTypeModule {}

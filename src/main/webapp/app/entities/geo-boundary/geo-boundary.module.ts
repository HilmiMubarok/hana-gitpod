import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { GeoBoundaryComponent } from './geo-boundary.component';
import { GeoBoundaryDetailComponent } from './geo-boundary-detail.component';
import { GeoBoundaryUpdateComponent } from './geo-boundary-update.component';
import { geoBoundaryRoute } from './geo-boundary.route';
import { GeoBoundaryViewComponent } from './geo-boundary-view.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(geoBoundaryRoute)],
  declarations: [GeoBoundaryComponent, GeoBoundaryDetailComponent, GeoBoundaryUpdateComponent, GeoBoundaryViewComponent],
  entryComponents: [GeoBoundaryComponent, GeoBoundaryUpdateComponent, GeoBoundaryViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwGeoBoundaryModule {}

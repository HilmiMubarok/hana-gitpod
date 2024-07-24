import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { UomTypeComponent } from './uom-type.component';
import { UomTypeDetailComponent } from './uom-type-detail.component';
import { UomTypeUpdateComponent } from './uom-type-update.component';
import { uomTypeRoute } from './uom-type.route';
import { UomTypeViewComponent } from './uom-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(uomTypeRoute)],
  declarations: [UomTypeComponent, UomTypeDetailComponent, UomTypeUpdateComponent, UomTypeViewComponent],
  entryComponents: [UomTypeComponent, UomTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwUomTypeModule {}

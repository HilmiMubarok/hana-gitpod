import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { UomComponent } from './uom.component';
import { UomDetailComponent } from './uom-detail.component';
import { UomUpdateComponent } from './uom-update.component';
import { uomRoute } from './uom.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(uomRoute)],
  declarations: [UomComponent, UomDetailComponent, UomUpdateComponent],
  entryComponents: [UomComponent, UomUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwUomModule {}

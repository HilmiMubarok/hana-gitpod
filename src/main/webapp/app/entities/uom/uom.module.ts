import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { UomComponent } from './uom.component';
import { UomDetailComponent } from './uom-detail.component';
import { UomUpdateComponent } from './uom-update.component';
import { uomRoute } from './uom.route';
import { UomViewComponent } from './uom-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(uomRoute)],
  declarations: [UomComponent, UomDetailComponent, UomUpdateComponent, UomViewComponent],
  entryComponents: [UomComponent, UomUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwUomModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { UomConversionComponent } from './uom-conversion.component';
import { UomConversionDetailComponent } from './uom-conversion-detail.component';
import { UomConversionUpdateComponent } from './uom-conversion-update.component';
import { uomConversionRoute } from './uom-conversion.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(uomConversionRoute)],
  declarations: [UomConversionComponent, UomConversionDetailComponent, UomConversionUpdateComponent],
  entryComponents: [UomConversionComponent, UomConversionUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwUomConversionModule {}

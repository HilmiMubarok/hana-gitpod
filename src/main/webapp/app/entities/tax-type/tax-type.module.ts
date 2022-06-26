import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { TaxTypeComponent } from './tax-type.component';
import { TaxTypeDetailComponent } from './tax-type-detail.component';
import { TaxTypeUpdateComponent } from './tax-type-update.component';
import { taxTypeRoute } from './tax-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(taxTypeRoute)],
  declarations: [TaxTypeComponent, TaxTypeDetailComponent, TaxTypeUpdateComponent],
  entryComponents: [TaxTypeComponent, TaxTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwTaxTypeModule {}

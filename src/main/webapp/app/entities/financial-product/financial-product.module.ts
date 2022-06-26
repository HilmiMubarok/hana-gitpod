import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { FinancialProductComponent } from './financial-product.component';
import { FinancialProductDetailComponent } from './financial-product-detail.component';
import { FinancialProductUpdateComponent } from './financial-product-update.component';
import { financialProductRoute } from './financial-product.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(financialProductRoute)],
  declarations: [FinancialProductComponent, FinancialProductDetailComponent, FinancialProductUpdateComponent],
  entryComponents: [FinancialProductComponent, FinancialProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFinancialProductModule {}

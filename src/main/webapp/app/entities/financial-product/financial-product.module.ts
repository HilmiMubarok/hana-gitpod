import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FinancialProductComponent } from './financial-product.component';
import { FinancialProductDetailComponent } from './financial-product-detail.component';
import { FinancialProductUpdateComponent } from './financial-product-update.component';
import { financialProductRoute } from './financial-product.route';
import { FinancialProductAsListComponent } from './financial-product-as-list.component';
import { FinancialProductViewComponent } from './financial-product-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(financialProductRoute)],
  declarations: [
    FinancialProductComponent,
    FinancialProductDetailComponent,
    FinancialProductUpdateComponent,
    FinancialProductAsListComponent,
    FinancialProductViewComponent,
  ],
  entryComponents: [FinancialProductComponent, FinancialProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwFinancialProductModule {}

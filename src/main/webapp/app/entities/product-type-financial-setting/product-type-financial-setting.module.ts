import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeFinancialSettingComponent } from './product-type-financial-setting.component';
import { ProductTypeFinancialSettingDetailComponent } from './product-type-financial-setting-detail.component';
import { ProductTypeFinancialSettingUpdateComponent } from './product-type-financial-setting-update.component';
import { productTypeFinancialSettingRoute } from './product-type-financial-setting.route';
import { ProductTypeFinancialSettingViewComponent } from './product-type-financial-setting-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productTypeFinancialSettingRoute)],
  declarations: [
    ProductTypeFinancialSettingComponent,
    ProductTypeFinancialSettingDetailComponent,
    ProductTypeFinancialSettingUpdateComponent,
    ProductTypeFinancialSettingViewComponent,
  ],
  entryComponents: [ProductTypeFinancialSettingComponent, ProductTypeFinancialSettingUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductTypeFinancialSettingModule {}

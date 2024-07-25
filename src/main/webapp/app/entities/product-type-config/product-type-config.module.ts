import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeConfigComponent } from './product-type-config.component';
import { ProductTypeConfigDetailComponent } from './product-type-config-detail.component';
import { ProductTypeConfigUpdateComponent } from './product-type-config-update.component';
import { productTypeConfigRoute } from './product-type-config.route';
import { ProductTypeConfigViewComponent } from './product-type-config-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productTypeConfigRoute)],
  declarations: [
    ProductTypeConfigComponent,
    ProductTypeConfigDetailComponent,
    ProductTypeConfigUpdateComponent,
    ProductTypeConfigViewComponent,
  ],
  entryComponents: [ProductTypeConfigComponent, ProductTypeConfigUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductTypeConfigModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceProductComponent } from './service-product.component';
import { ServiceProductDetailComponent } from './service-product-detail.component';
import { ServiceProductUpdateComponent } from './service-product-update.component';
import { serviceProductRoute } from './service-product.route';
import { ServiceProductAsListComponent } from './service-product-as-list.component';
import { ServiceProductViewComponent } from './service-product-view.component';
@NgModule({
  imports: [SharedModule, RouterModule.forChild(serviceProductRoute)],
  declarations: [
    ServiceProductComponent,
    ServiceProductDetailComponent,
    ServiceProductUpdateComponent,
    ServiceProductAsListComponent,
    ServiceProductViewComponent,
  ],
  entryComponents: [ServiceProductComponent, ServiceProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwServiceProductModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ServiceProductComponent } from './service-product.component';
import { ServiceProductDetailComponent } from './service-product-detail.component';
import { ServiceProductUpdateComponent } from './service-product-update.component';
import { serviceProductRoute } from './service-product.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(serviceProductRoute)],
  declarations: [ServiceProductComponent, ServiceProductDetailComponent, ServiceProductUpdateComponent],
  entryComponents: [ServiceProductComponent, ServiceProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwServiceProductModule {}

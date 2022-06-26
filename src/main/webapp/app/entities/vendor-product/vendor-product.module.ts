import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { VendorProductComponent } from './vendor-product.component';
import { VendorProductDetailComponent } from './vendor-product-detail.component';
import { VendorProductUpdateComponent } from './vendor-product-update.component';
import { vendorProductRoute } from './vendor-product.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(vendorProductRoute)],
  declarations: [VendorProductComponent, VendorProductDetailComponent, VendorProductUpdateComponent],
  entryComponents: [VendorProductComponent, VendorProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwVendorProductModule {}

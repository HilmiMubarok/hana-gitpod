import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { vendorProductRoute } from './vendor-product.route';
import { VendorProductViewComponent } from './vendor-product-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(vendorProductRoute)],
  declarations: [VendorProductViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwVendorProductModule {}

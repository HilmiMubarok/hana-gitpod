import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationProductComponent } from './application-product.component';
import { ApplicationProductDetailComponent } from './application-product-detail.component';
import { ApplicationProductUpdateComponent } from './application-product-update.component';
import { applicationProductRoute } from './application-product.route';
import { ApplicationProductViewComponent } from './application-product-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(applicationProductRoute)],
  declarations: [
    ApplicationProductComponent,
    ApplicationProductDetailComponent,
    ApplicationProductUpdateComponent,
    ApplicationProductViewComponent,
  ],
  entryComponents: [ApplicationProductComponent, ApplicationProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwApplicationProductModule {}

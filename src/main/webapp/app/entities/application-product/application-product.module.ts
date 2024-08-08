import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationProductComponent } from './application-product.component';
import { ApplicationProductDetailComponent } from './application-product-detail.component';
import { ApplicationProductUpdateComponent } from './application-product-update.component';
import { applicationProductRoute } from './application-product.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(applicationProductRoute)],
  declarations: [ApplicationProductComponent, ApplicationProductDetailComponent, ApplicationProductUpdateComponent],
  entryComponents: [ApplicationProductComponent, ApplicationProductUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwApplicationProductModule {}

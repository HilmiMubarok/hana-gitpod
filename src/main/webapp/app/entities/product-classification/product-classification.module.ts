import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProductClassificationComponent } from './product-classification.component';
import { ProductClassificationDetailComponent } from './product-classification-detail.component';
import { ProductClassificationUpdateComponent } from './product-classification-update.component';
import { productClassificationRoute } from './product-classification.route';
import { ProductClassificationViewComponent } from './product-classification-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productClassificationRoute)],
  declarations: [
    ProductClassificationComponent,
    ProductClassificationDetailComponent,
    ProductClassificationUpdateComponent,
    ProductClassificationViewComponent,
  ],
  entryComponents: [ProductClassificationComponent, ProductClassificationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductClassificationModule {}

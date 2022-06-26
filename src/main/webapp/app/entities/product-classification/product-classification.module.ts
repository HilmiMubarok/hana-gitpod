import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProductClassificationComponent } from './product-classification.component';
import { ProductClassificationDetailComponent } from './product-classification-detail.component';
import { ProductClassificationUpdateComponent } from './product-classification-update.component';
import { productClassificationRoute } from './product-classification.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(productClassificationRoute)],
  declarations: [ProductClassificationComponent, ProductClassificationDetailComponent, ProductClassificationUpdateComponent],
  entryComponents: [ProductClassificationComponent, ProductClassificationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductClassificationModule {}

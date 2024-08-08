import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCategoryTypeComponent } from './product-category-type.component';
import { ProductCategoryTypeDetailComponent } from './product-category-type-detail.component';
import { ProductCategoryTypeUpdateComponent } from './product-category-type-update.component';
import { productCategoryTypeRoute } from './product-category-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(productCategoryTypeRoute)],
  declarations: [ProductCategoryTypeComponent, ProductCategoryTypeDetailComponent, ProductCategoryTypeUpdateComponent],
  entryComponents: [ProductCategoryTypeComponent, ProductCategoryTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductCategoryTypeModule {}

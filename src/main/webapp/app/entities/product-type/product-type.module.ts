import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeComponent } from './product-type.component';
import { ProductTypeDetailComponent } from './product-type-detail.component';
import { ProductTypeUpdateComponent } from './product-type-update.component';
import { productTypeRoute } from './product-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(productTypeRoute)],
  declarations: [ProductTypeComponent, ProductTypeDetailComponent, ProductTypeUpdateComponent],
  entryComponents: [ProductTypeComponent, ProductTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductTypeModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeConfigComponent } from './product-type-config.component';
import { ProductTypeConfigDetailComponent } from './product-type-config-detail.component';
import { ProductTypeConfigUpdateComponent } from './product-type-config-update.component';
import { productTypeConfigRoute } from './product-type-config.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(productTypeConfigRoute)],
  declarations: [ProductTypeConfigComponent, ProductTypeConfigDetailComponent, ProductTypeConfigUpdateComponent],
  entryComponents: [ProductTypeConfigComponent, ProductTypeConfigUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductTypeConfigModule {}

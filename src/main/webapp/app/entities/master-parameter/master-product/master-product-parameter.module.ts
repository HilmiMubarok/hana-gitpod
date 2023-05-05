import { SharedModule } from 'app/shared/shared.module';
import { masterProduct } from './master-product-parameter.route';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { RouterModule } from '@angular/router';
import { MasterProductParameterComponent } from './master-product-parameter.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MasterProductParameterDialogComponent } from './master-product-parameter-dialog.component';
import { CategoryProductDialogComponent } from './category-product-dialog/category-product-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(masterProduct)],
  declarations: [MasterProductParameterComponent, MasterProductParameterDialogComponent, CategoryProductDialogComponent],

  entryComponents: [MasterProductParameterDialogComponent, CategoryProductDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMasterProductParameterModule {}

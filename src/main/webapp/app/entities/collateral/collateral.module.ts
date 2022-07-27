import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralComponent } from './collateral.component';
import { CollateralDetailComponent } from './collateral-detail.component';
import { CollateralUpdateComponent } from './collateral-update.component';
import { collateralRoute } from './collateral.route';
import { GridModule, PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(collateralRoute)],
  declarations: [CollateralComponent, CollateralDetailComponent, CollateralUpdateComponent],
  entryComponents: [CollateralComponent, CollateralUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PageService, ToolbarService, EditService],
})
export class LosgwCollateralModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralComponent } from './collateral.component';
import { CollateralDetailComponent } from './collateral-detail.component';
import { CollateralUpdateComponent } from './collateral-update.component';
import { collateralRoute } from './collateral.route';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { SharedEntityModule } from '../shared-entity.module';

@NgModule({
  imports: [GridModule, SharedModule, GridModule, SharedEntityModule, RouterModule.forChild(collateralRoute)],
  declarations: [CollateralComponent, CollateralDetailComponent],
  entryComponents: [CollateralComponent, CollateralUpdateComponent],
  providers: [PageService, SortService, FilterService, GroupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralModule {}

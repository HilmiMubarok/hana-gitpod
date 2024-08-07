import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralTypeComponent } from './collateral-type.component';
import { CollateralTypeDetailComponent } from './collateral-type-detail.component';
import { CollateralTypeUpdateComponent } from './collateral-type-update.component';
import { collateralTypeRoute } from './collateral-type.route';
import { CollateralTypeViewComponent } from './collateral-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(collateralTypeRoute)],
  declarations: [CollateralTypeComponent, CollateralTypeDetailComponent, CollateralTypeUpdateComponent, CollateralTypeViewComponent],
  entryComponents: [CollateralTypeComponent, CollateralTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralTypeModule {}

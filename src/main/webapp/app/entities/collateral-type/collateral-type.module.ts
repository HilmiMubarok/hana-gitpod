import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralTypeComponent } from './collateral-type.component';
import { CollateralTypeDetailComponent } from './collateral-type-detail.component';
import { CollateralTypeUpdateComponent } from './collateral-type-update.component';
import { collateralTypeRoute } from './collateral-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(collateralTypeRoute)],
  declarations: [CollateralTypeComponent, CollateralTypeDetailComponent, CollateralTypeUpdateComponent],
  entryComponents: [CollateralTypeComponent, CollateralTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralTypeModule {}

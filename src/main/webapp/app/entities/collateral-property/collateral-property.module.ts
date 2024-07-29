import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralPropertyComponent } from './collateral-property.component';
import { CollateralPropertyDetailComponent } from './collateral-property-detail.component';
import { CollateralPropertyUpdateComponent } from './collateral-property-update.component';
import { collateralPropertyRoute } from './collateral-property.route';
import { CollateralPropertyViewComponent } from './collateral-property-view.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(collateralPropertyRoute)],
  declarations: [
    CollateralPropertyComponent,
    CollateralPropertyDetailComponent,
    CollateralPropertyUpdateComponent,
    CollateralPropertyViewComponent,
  ],
  entryComponents: [CollateralPropertyComponent, CollateralPropertyUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralPropertyModule {}

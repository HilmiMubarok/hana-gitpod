import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditFacilityComponent } from './credit-facility.component';
import { CreditFacilityDetailComponent } from './credit-facility-detail.component';
import { CreditFacilityUpdateComponent } from './credit-facility-update.component';
import { creditFacilityRoute } from './credit-facility.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(creditFacilityRoute)],
  declarations: [CreditFacilityComponent, CreditFacilityDetailComponent, CreditFacilityUpdateComponent],
  entryComponents: [CreditFacilityComponent, CreditFacilityUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditFacilityModule {}

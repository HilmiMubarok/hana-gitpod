import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { CreditFacilityComponent } from './credit-facility.component';
import { CreditFacilityDetailComponent } from './credit-facility-detail.component';
import { CreditFacilityUpdateComponent } from './credit-facility-update.component';
import { creditFacilityRoute } from './credit-facility.route';
import { CreditFacilityViewComponent } from './credit-facility-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(creditFacilityRoute)],
  declarations: [CreditFacilityComponent, CreditFacilityDetailComponent, CreditFacilityUpdateComponent, CreditFacilityViewComponent],
  entryComponents: [CreditFacilityComponent, CreditFacilityUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditFacilityModule {}

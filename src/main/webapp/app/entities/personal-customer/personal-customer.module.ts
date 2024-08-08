import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PersonalCustomerComponent } from './personal-customer.component';
import { PersonalCustomerDetailComponent } from './personal-customer-detail.component';
import { PersonalCustomerUpdateComponent } from './personal-customer-update.component';
import { personalCustomerRoute } from './personal-customer.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(personalCustomerRoute)],
  declarations: [PersonalCustomerComponent, PersonalCustomerDetailComponent, PersonalCustomerUpdateComponent],
  entryComponents: [PersonalCustomerComponent, PersonalCustomerUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPersonalCustomerModule {}

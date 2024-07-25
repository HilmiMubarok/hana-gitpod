import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PersonalCustomerComponent } from './personal-customer.component';
import { PersonalCustomerDetailComponent } from './personal-customer-detail.component';
import { PersonalCustomerUpdateComponent } from './personal-customer-update.component';
import { personalCustomerRoute } from './personal-customer.route';
import { PersonalCustomerViewComponent } from './personal-customer-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(personalCustomerRoute)],
  declarations: [
    PersonalCustomerComponent,
    PersonalCustomerDetailComponent,
    PersonalCustomerUpdateComponent,
    PersonalCustomerViewComponent,
  ],
  entryComponents: [PersonalCustomerComponent, PersonalCustomerUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPersonalCustomerModule {}

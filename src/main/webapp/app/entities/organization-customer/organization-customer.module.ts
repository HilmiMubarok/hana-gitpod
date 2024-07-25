import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationCustomerComponent } from './organization-customer.component';
import { OrganizationCustomerDetailComponent } from './organization-customer-detail.component';
import { OrganizationCustomerUpdateComponent } from './organization-customer-update.component';
import { organizationCustomerRoute } from './organization-customer.route';
import { OrganizationCustomerViewComponent } from './organization-customer-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(organizationCustomerRoute)],
  declarations: [
    OrganizationCustomerComponent,
    OrganizationCustomerDetailComponent,
    OrganizationCustomerUpdateComponent,
    OrganizationCustomerViewComponent,
  ],
  entryComponents: [OrganizationCustomerComponent, OrganizationCustomerUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOrganizationCustomerModule {}

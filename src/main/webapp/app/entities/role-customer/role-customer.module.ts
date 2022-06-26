import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RoleCustomerComponent } from './role-customer.component';
import { RoleCustomerDetailComponent } from './role-customer-detail.component';
import { RoleCustomerUpdateComponent } from './role-customer-update.component';
import { roleCustomerRoute } from './role-customer.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(roleCustomerRoute)],
  declarations: [RoleCustomerComponent, RoleCustomerDetailComponent, RoleCustomerUpdateComponent],
  entryComponents: [RoleCustomerComponent, RoleCustomerUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwRoleCustomerModule {}

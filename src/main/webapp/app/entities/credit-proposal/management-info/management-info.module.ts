import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposaTabManagementInfoComponent } from '../credit-proposal-tab-management-info.component';
import { OrganizationManagementListComponent } from 'app/entities/organization-management/organization-management-list.component';
import { DialogBorrowerComponent } from '../credit-proposal-dialog-borrower.component';

@NgModule({
  declarations: [CreditProposaTabManagementInfoComponent, OrganizationManagementListComponent, DialogBorrowerComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreditProposaTabManagementInfoComponent, OrganizationManagementListComponent, DialogBorrowerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManagementInfoModule {}

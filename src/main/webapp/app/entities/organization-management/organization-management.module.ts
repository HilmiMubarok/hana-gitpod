import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationManagementComponent } from './list/organization-management.component';
import { OrganizationManagementDetailComponent } from './detail/organization-management-detail.component';
import { OrganizationManagementUpdateComponent } from './update/organization-management-update.component';
import { OrganizationManagementDeleteDialogComponent } from './delete/organization-management-delete-dialog.component';
import { OrganizationManagementRoutingModule } from './route/organization-management-routing.module';

@NgModule({
  imports: [SharedModule, OrganizationManagementRoutingModule],
  declarations: [
    OrganizationManagementComponent,
    OrganizationManagementDetailComponent,
    OrganizationManagementUpdateComponent,
    OrganizationManagementDeleteDialogComponent,
  ],
  entryComponents: [OrganizationManagementDeleteDialogComponent],
})
export class OrganizationManagementModule {}

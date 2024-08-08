import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationManagementComponent } from './organization-management.component';
import { OrganizationManagementDetailComponent } from './organization-management-detail.component';
import { OrganizationManagementUpdateComponent } from './organization-management-update.component';
import { organizationManagementRoute } from './organization-management.route';
import { OrganizationManagementBusinessGroupDialogComponent } from './organization-management-business-group-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(organizationManagementRoute)],
  declarations: [
    OrganizationManagementComponent,
    OrganizationManagementDetailComponent,
    OrganizationManagementUpdateComponent,
    OrganizationManagementBusinessGroupDialogComponent,
  ],
  entryComponents: [OrganizationManagementComponent, OrganizationManagementUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOrganizationManagementModule {}

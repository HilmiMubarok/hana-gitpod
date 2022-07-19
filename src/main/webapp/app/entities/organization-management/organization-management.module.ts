import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationManagementComponent } from './organization-management.component';
import { OrganizationManagementDetailComponent } from './organization-management-detail.component';
import { OrganizationManagementUpdateComponent } from './organization-management-update.component';
import { organizationManagementRoute } from './organization-management.route';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, FilterService, PageSettingsModel, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(organizationManagementRoute), GridModule],
  declarations: [OrganizationManagementComponent, OrganizationManagementDetailComponent, OrganizationManagementUpdateComponent],
  entryComponents: [OrganizationManagementComponent, OrganizationManagementUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PageService, FilterService, ToolbarService, EditService],
})
export class LosgwOrganizationManagementModule {}

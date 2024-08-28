import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationLegalComponent } from './organization-legal.component';
import { OrganizationLegalDetailComponent } from './organization-legal-detail.component';
import { OrganizationLegalUpdateComponent } from './organization-legal-update.component';
import { organizationLegalRoute } from './organization-legal.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(organizationLegalRoute)],
  declarations: [OrganizationLegalComponent, OrganizationLegalDetailComponent, OrganizationLegalUpdateComponent],
  entryComponents: [OrganizationLegalComponent, OrganizationLegalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOrganizationLegalModule {}

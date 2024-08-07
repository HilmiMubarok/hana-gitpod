import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationLegalComponent } from './organization-legal.component';
import { OrganizationLegalDetailComponent } from './organization-legal-detail.component';
import { OrganizationLegalUpdateComponent } from './organization-legal-update.component';
import { organizationLegalRoute } from './organization-legal.route';
import { OrganizationLegalViewComponent } from './organization-legal-view.component';
@NgModule({
  imports: [SharedModule, RouterModule.forChild(organizationLegalRoute)],
  declarations: [
    OrganizationLegalComponent,
    OrganizationLegalDetailComponent,
    OrganizationLegalUpdateComponent,
    OrganizationLegalViewComponent,
  ],
  entryComponents: [OrganizationLegalComponent, OrganizationLegalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOrganizationLegalModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationFinancialComponent } from './organization-financial.component';
import { OrganizationFinancialDetailComponent } from './organization-financial-detail.component';
import { OrganizationFinancialUpdateComponent } from './organization-financial-update.component';
import { organizationFinancialRoute } from './organization-financial.route';
import { OrganizationFinancialViewComponent } from './organization-financial-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(organizationFinancialRoute)],
  declarations: [
    OrganizationFinancialComponent,
    OrganizationFinancialDetailComponent,
    OrganizationFinancialUpdateComponent,
    OrganizationFinancialViewComponent,
  ],
  entryComponents: [OrganizationFinancialComponent, OrganizationFinancialUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOrganizationFinancialModule {}

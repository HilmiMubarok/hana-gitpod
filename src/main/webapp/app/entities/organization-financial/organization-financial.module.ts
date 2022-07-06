import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { OrganizationFinancialComponent } from './organization-financial.component';
import { OrganizationFinancialDetailComponent } from './organization-financial-detail.component';
import { OrganizationFinancialUpdateComponent } from './organization-financial-update.component';
import { organizationFinancialRoute } from './organization-financial.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(organizationFinancialRoute)],
  declarations: [OrganizationFinancialComponent, OrganizationFinancialDetailComponent, OrganizationFinancialUpdateComponent],
  entryComponents: [OrganizationFinancialComponent, OrganizationFinancialUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOrganizationFinancialModule {}
